/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditLogEntity } from './entities/audit-log.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Create audit log entry' })
  @ApiResponse({ status: 201, type: AuditLogEntity })
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'List audit logs' })
  findAll(@Query() query: QueryAuditLogDto) {
    return this.auditService.findAll(query);
  }

  @Get(':id')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Get audit log by id' })
  @ApiResponse({ status: 200, type: AuditLogEntity })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete audit log entry' })
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}
