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
import { GovernanceService } from './governance.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { QueryPolicyDto } from './dto/query-policy.dto';
import { GovernancePolicyEntity } from './entities/governance-policy.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Governance')
@ApiBearerAuth()
@Controller('governance/policies')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post()
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Create governance policy' })
  @ApiResponse({
    status: 201,
    type: GovernancePolicyEntity,
  })
  create(@Body() dto: CreatePolicyDto) {
    return this.governanceService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'List governance policies' })
  findAll(@Query() query: QueryPolicyDto) {
    return this.governanceService.findAll(query);
  }

  @Get('stats')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST')
  @ApiOperation({ summary: 'Governance policy statistics' })
  stats() {
    return this.governanceService.stats();
  }

  @Get(':id')
  @Roles('ADMIN', 'GOVERNANCE', 'ANALYST', 'VIEWER')
  @ApiOperation({ summary: 'Get policy by id' })
  @ApiResponse({
    status: 200,
    type: GovernancePolicyEntity,
  })
  findOne(@Param('id') id: string) {
    return this.governanceService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Update governance policy' })
  update(@Param('id') id: string, @Body() dto: UpdatePolicyDto) {
    return this.governanceService.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Activate policy' })
  activate(@Param('id') id: string) {
    return this.governanceService.activate(id);
  }

  @Patch(':id/deactivate')
  @Roles('ADMIN', 'GOVERNANCE')
  @ApiOperation({ summary: 'Deactivate policy' })
  deactivate(@Param('id') id: string) {
    return this.governanceService.deactivate(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete governance policy' })
  remove(@Param('id') id: string) {
    return this.governanceService.remove(id);
  }
}
