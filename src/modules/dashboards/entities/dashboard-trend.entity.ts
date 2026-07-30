import { ApiProperty } from '@nestjs/swagger';

export class DashboardTrendEntity {
  @ApiProperty({
    example: '2026-07-01',
  })
  date!: string;

  @ApiProperty({
    example: 15,
  })
  value!: number;
}
