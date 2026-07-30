import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BenchmarksService } from './benchmarks.service';
import { CreateBenchmarkDto } from './dto/create-benchmark.dto';
import { QueryBenchmarkDto } from './dto/query-benchmark.dto';
import { RunBenchmarkDto } from './dto/run-benchmark.dto';
import { BenchmarkRunEntity } from './entities/benchmark-run.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Benchmarks')
@ApiBearerAuth()
@Controller('benchmarks')
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarksService) {}

  @Post()
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Create benchmark record' })
  @ApiResponse({
    status: 201,
    type: BenchmarkRunEntity,
  })
  create(@Body() dto: CreateBenchmarkDto) {
    return this.benchmarksService.create(dto);
  }

  @Post('run')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Execute benchmark' })
  @ApiResponse({
    status: 201,
    type: BenchmarkRunEntity,
  })
  run(@Body() dto: RunBenchmarkDto) {
    return this.benchmarksService.run(dto);
  }

  @Get()
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST')
  @ApiOperation({ summary: 'List benchmark runs' })
  findAll(@Query() query: QueryBenchmarkDto) {
    return this.benchmarksService.findAll(query);
  }

  @Get('summary')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST')
  @ApiOperation({ summary: 'Benchmark summary statistics' })
  summary() {
    return this.benchmarksService.summary();
  }

  @Get(':id')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST')
  @ApiOperation({ summary: 'Get benchmark by id' })
  @ApiResponse({
    status: 200,
    type: BenchmarkRunEntity,
  })
  findOne(@Param('id') id: string) {
    return this.benchmarksService.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete benchmark run' })
  remove(@Param('id') id: string) {
    return this.benchmarksService.remove(id);
  }
}
