/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermissionDto) {
    const exists = await this.prisma.permission.findUnique({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Permission already exists');
    }

    return this.prisma.permission.create({
      data: dto,
    });
  }

  async findAll(query: QueryPermissionDto) {
    const { page, limit, search } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.permission.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);

    return this.prisma.permission.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.permission.delete({
      where: { id },
    });
  }

  async assignToRole(dto: AssignPermissionDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.prisma.permission.findUnique({
      where: { id: dto.permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const existing = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: dto.roleId,
          permissionId: dto.permissionId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Permission already assigned to role');
    }

    return this.prisma.rolePermission.create({
      data: {
        roleId: dto.roleId,
        permissionId: dto.permissionId,
      },
      include: {
        role: true,
        permission: true,
      },
    });
  }

  async removeFromRole(dto: AssignPermissionDto) {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: dto.roleId,
          permissionId: dto.permissionId,
        },
      },
    });

    return {
      message: 'Permission removed from role successfully',
    };
  }

  async findByRole(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      role: {
        id: role.id,
        name: role.name,
      },
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }

  async stats() {
    const [totalPermissions, totalAssignments] = await Promise.all([
      this.prisma.permission.count(),
      this.prisma.rolePermission.count(),
    ]);

    const permissions = await this.prisma.permission.findMany({
      include: {
        roles: true,
      },
    });

    const usage = permissions.map((p) => ({
      id: p.id,
      name: p.name,
      assignedRoles: p.roles.length,
    }));

    return {
      totalPermissions,
      totalAssignments,
      usage,
    };
  }
}
