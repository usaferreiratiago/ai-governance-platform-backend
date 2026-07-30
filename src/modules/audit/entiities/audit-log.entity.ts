import { ApiProperty } from '@nestjs/swagger';

export class AuditLogEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  userId?: string | null;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  entity!: string;

  @ApiProperty({ required: false })
  entityId?: string | null;

  @ApiProperty({ type: Object, required: false })
  metadata?: Record<string, any> | null;

  @ApiProperty()
  createdAt!: Date;
}
