import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionEntity } from './entities/permission.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({
    status: 201,
    type: PermissionEntity,
  })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'List permissions' })
  findAll(@Query() query: QueryPermissionDto) {
    return this.permissionsService.findAll(query);
  }

  @Get('stats')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Permission statistics' })
  stats() {
    return this.permissionsService.stats();
  }

  @Get('role/:roleId')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({
    summary: 'List permissions assigned to role',
  })
  findByRole(@Param('roleId') roleId: string) {
    return this.permissionsService.findByRole(roleId);
  }

  @Get(':id')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiResponse({
    status: 200,
    type: PermissionEntity,
  })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update permission' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post('assign')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Assign permission to role' })
  assignToRole(@Body() dto: AssignPermissionDto) {
    return this.permissionsService.assignToRole(dto);
  }

  @Post('unassign')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Remove permission from role',
  })
  removeFromRole(@Body() dto: AssignPermissionDto) {
    return this.permissionsService.removeFromRole(dto);
  }
}
