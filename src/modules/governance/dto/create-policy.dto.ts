import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty({
    example: 'PII Access Policy',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Controls access to personally identifiable information',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'SECURITY',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  version!: string;

  @ApiPropertyOptional({
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    type: Object,
    example: {
      classification: 'CONFIDENTIAL',
      allowedRoles: ['ADMIN', 'GOVERNANCE'],
    },
  })
  @IsOptional()
  @IsObject()
  rules?: Record<string, any>;
}
