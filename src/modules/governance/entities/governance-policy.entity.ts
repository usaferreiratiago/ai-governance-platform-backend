import { ApiProperty } from '@nestjs/swagger';

export class GovernancePolicyEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  version!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: Object, required: false })
  rules?: Record<string, any> | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
