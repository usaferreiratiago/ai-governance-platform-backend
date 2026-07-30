/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      totalSemanticModels,
      activeSemanticModels,
      totalBenchmarkRuns,
      benchmarkAggregate,
      totalAuditLogs,
      auditLogsToday,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { isActive: true },
      }),
      this.prisma.semanticModel.count(),
      this.prisma.semanticModel.count({
        where: { isActive: true },
      }),
      this.prisma.benchmarkRun.count(),
      this.prisma.benchmarkRun.aggregate({
        _avg: { score: true },
      }),
      this.prisma.auditLog.count(),
      this.prisma.auditLog.count({
        where: {
          createdAt: { gte: today },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalSemanticModels,
      activeSemanticModels,
      totalBenchmarkRuns,
      averageBenchmarkScore: Number(
        (benchmarkAggregate._avg.score ?? 0).toFixed(3),
      ),
      totalAuditLogs,
      auditLogsToday,
    };
  }

  async recentActivity(limit = 10) {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      createdAt: log.createdAt,
      user: log.user,
    }));
  }

  async benchmarkTrend(days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const runs = await this.prisma.benchmarkRun.findMany({
      where: {
        createdAt: { gte: from },
      },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = new Map<string, number[]>();

    for (const run of runs) {
      const date = run.createdAt.toISOString().slice(0, 10);

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push(run.score);
    }

    return Array.from(grouped.entries()).map(([date, scores]) => ({
      date,
      value: Number(
        (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(3),
      ),
    }));
  }

  async auditTrend(days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: { gte: from },
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    const grouped = new Map<string, number>();

    for (const log of logs) {
      const date = log.createdAt.toISOString().slice(0, 10);

      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  }

  async semanticModelStats() {
    const models = await this.prisma.semanticModel.findMany({
      select: {
        id: true,
        isActive: true,
        version: true,
      },
    });

    const total = models.length;
    const active = models.filter((m) => m.isActive).length;

    const versions = models.reduce((acc, model) => {
      acc[model.version] = (acc[model.version] ?? 0) + 1;
      return acc;
    }, {});

    return {
      total,
      active,
      inactive: total - active,
      versions,
    };
  }

  async userStats() {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const byRole: Record<string, number> = {};

    for (const user of users) {
      for (const userRole of user.roles) {
        const roleName = userRole.role.name;
        byRole[roleName] = (byRole[roleName] ?? 0) + 1;
      }
    }

    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
      byRole,
    };
  }

  async overview(days = 30) {
    const [
      summary,
      recentActivity,
      benchmarkTrend,
      auditTrend,
      semanticModels,
      users,
    ] = await Promise.all([
      this.summary(),
      this.recentActivity(10),
      this.benchmarkTrend(days),
      this.auditTrend(days),
      this.semanticModelStats(),
      this.userStats(),
    ]);

    return {
      summary,
      recentActivity,
      benchmarkTrend,
      auditTrend,
      semanticModels,
      users,
    };
  }
}
