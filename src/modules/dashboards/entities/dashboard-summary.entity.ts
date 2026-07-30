import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryEntity {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  activeUsers!: number;

  @ApiProperty()
  totalSemanticModels!: number;

  @ApiProperty()
  activeSemanticModels!: number;

  @ApiProperty()
  totalBenchmarkRuns!: number;

  @ApiProperty()
  averageBenchmarkScore!: number;

  @ApiProperty()
  totalAuditLogs!: number;

  @ApiProperty()
  auditLogsToday!: number;
}
