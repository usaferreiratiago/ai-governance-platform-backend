import { Module } from '@nestjs/common';
import { BenchmarksService } from './benchmarks.service';
import { BenchmarksController } from './benchmarks.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BenchmarksController],
  providers: [BenchmarksService],
  exports: [BenchmarksService],
})
export class BenchmarksModule {}
