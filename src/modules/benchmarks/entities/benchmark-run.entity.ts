import { ApiProperty } from '@nestjs/swagger';

export class BenchmarkRunEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false, type: Object })
  details?: Record<string, any> | null;

  @ApiProperty()
  createdAt!: Date;
}
