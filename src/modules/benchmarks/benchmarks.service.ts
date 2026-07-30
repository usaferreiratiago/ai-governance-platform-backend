/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBenchmarkDto } from './dto/create-benchmark.dto';
import { QueryBenchmarkDto } from './dto/query-benchmark.dto';
import { RunBenchmarkDto } from './dto/run-benchmark.dto';

@Injectable()
export class BenchmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBenchmarkDto) {
    return this.prisma.benchmarkRun.create({
      data: {
        name: dto.name,
        score: dto.score,
        status: dto.status,
        details: dto.details,
      },
    });
  }

  async run(dto: RunBenchmarkDto) {
    // TODO: integrate real AI evaluation pipeline

    const simulatedScore = Number((0.8 + Math.random() * 0.2).toFixed(3));

    const result = await this.prisma.benchmarkRun.create({
      data: {
        name: dto.name,
        score: simulatedScore,
        status: 'COMPLETED',
        details: {
          modelName: dto.modelName ?? 'default-model',
          datasetIds: dto.datasetIds ?? [],
          options: dto.options ?? {},
          executionTimeMs: Math.floor(Math.random() * 2000 + 500),
          samples: dto.datasetIds?.length ?? 10,
        },
      },
    });

    return result;
  }

  async findAll(query: QueryBenchmarkDto) {
    const { page, limit, name, status, from, to } = query;

    const where: any = {};

    if (name) where.name = { contains: name };
    if (status) where.status = status;

    if (from || to) {
      where.createdAt = {};

      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      this.prisma.benchmarkRun.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.benchmarkRun.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.benchmarkRun.findUnique({
      where: { id },
    });
  }

  async summary() {
    const runs = await this.prisma.benchmarkRun.findMany();

    const totalRuns = runs.length;

    const avgScore =
      totalRuns === 0
        ? 0
        : runs.reduce((acc, r) => acc + r.score, 0) / totalRuns;

    const bestScore =
      totalRuns === 0 ? 0 : Math.max(...runs.map((r) => r.score));

    const worstScore =
      totalRuns === 0 ? 0 : Math.min(...runs.map((r) => r.score));

    const byStatus = runs.reduce((acc, run) => {
      acc[run.status] = (acc[run.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalRuns,
      averageScore: Number(avgScore.toFixed(3)),
      bestScore,
      worstScore,
      byStatus,
    };
  }

  async remove(id: string) {
    return this.prisma.benchmarkRun.delete({
      where: { id },
    });
  }
}
