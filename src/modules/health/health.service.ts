/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private readonly redis?: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('redis.host');

    const port = this.configService.get<number>('redis.port');

    const password = this.configService.get<string>('redis.password');

    if (host && port) {
      this.redis = new Redis({
        host,
        port,
        password,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });
    }
  }

  async liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async readiness() {
    const db = await this.checkDatabase();

    return {
      status: db.status === 'up' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: db,
    };
  }

  async detailed() {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const overall =
      database.status === 'up' && redis.status === 'up' ? 'ok' : 'error';

    return {
      status: overall,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: this.configService.get<string>('app.env') ?? 'development',
      database,
      redis,
      memory: process.memoryUsage(),
    };
  }

  private async checkDatabase() {
    const start = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'up' as const,
        responseTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      return {
        status: 'down' as const,
        responseTimeMs: Date.now() - start,
        message: error.message,
      };
    }
  }

  private async checkRedis() {
    if (!this.redis) {
      return {
        status: 'down' as const,
        message: 'Redis not configured',
      };
    }

    const start = Date.now();

    try {
      await this.redis.connect();
      await this.redis.ping();
      await this.redis.quit();

      return {
        status: 'up' as const,
        responseTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      return {
        status: 'down' as const,
        responseTimeMs: Date.now() - start,
        message: error.message,
      };
    }
  }
}
