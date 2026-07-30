import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../../common/decorators/public.decorator';
import { HealthEntity } from './entities/health.entity';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
  })
  live() {
    return this.healthService.liveness();
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
  })
  ready() {
    return this.healthService.readiness();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Detailed health report' })
  @ApiResponse({
    status: 200,
    type: HealthEntity,
  })
  health() {
    return this.healthService.detailed();
  }
}
