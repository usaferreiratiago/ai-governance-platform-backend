import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { DashboardSummaryEntity } from './entities/dashboard-summary.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboards')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('summary')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Dashboard summary metrics' })
  @ApiResponse({
    status: 200,
    type: DashboardSummaryEntity,
  })
  summary() {
    return this.dashboardsService.summary();
  }

  @Get('recent-activity')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Recent platform activity' })
  recentActivity() {
    return this.dashboardsService.recentActivity();
  }

  @Get('benchmark-trend')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Benchmark score trend' })
  benchmarkTrend(@Query() query: DashboardQueryDto) {
    return this.dashboardsService.benchmarkTrend(query.days);
  }

  @Get('audit-trend')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Audit activity trend' })
  auditTrend(@Query() query: DashboardQueryDto) {
    return this.dashboardsService.auditTrend(query.days);
  }

  @Get('semantic-models')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Semantic model statistics' })
  semanticModels() {
    return this.dashboardsService.semanticModelStats();
  }

  @Get('users')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'User statistics' })
  users() {
    return this.dashboardsService.userStats();
  }

  @Get('overview')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({
    summary: 'Complete dashboard payload',
  })
  overview(@Query() query: DashboardQueryDto) {
    return this.dashboardsService.overview(query.days);
  }
}
