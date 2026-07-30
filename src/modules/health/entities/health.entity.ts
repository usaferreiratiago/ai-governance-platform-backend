import { ApiProperty } from '@nestjs/swagger';

export class ServiceHealthEntity {
  @ApiProperty({ example: 'up' })
  status: 'up' | 'down' = 'up';

  @ApiProperty({ example: 12 })
  responseTimeMs?: number;

  @ApiProperty({ required: false })
  message?: string;
}

export class HealthEntity {
  @ApiProperty({ example: 'ok' })
  status: 'ok' | 'error' = 'ok';

  @ApiProperty()
  timestamp!: string;

  @ApiProperty({ example: 3600 })
  uptimeSeconds!: number;

  @ApiProperty({ example: 'development' })
  environment!: string;

  @ApiProperty({
    type: ServiceHealthEntity,
  })
  database: ServiceHealthEntity = new ServiceHealthEntity();

  @ApiProperty({
    type: ServiceHealthEntity,
  })
  redis: ServiceHealthEntity = new ServiceHealthEntity();

  @ApiProperty({
    example: {
      rss: 120000000,
      heapTotal: 80000000,
      heapUsed: 60000000,
      external: 5000000,
    },
  })
  memory!: Record<string, number>;
}
