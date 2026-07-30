/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { QueryPolicyDto } from './dto/query-policy.dto';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePolicyDto) {
    return this.prisma.governancePolicy.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        version: dto.version,
        isActive: dto.isActive ?? true,
        rules: dto.rules,
      },
    });
  }

  async findAll(query: QueryPolicyDto) {
    const { page, limit, search, category, isActive } = query;

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

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [items, total] = await Promise.all([
      this.prisma.governancePolicy.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.governancePolicy.count({ where }),
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
    const policy = await this.prisma.governancePolicy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new NotFoundException('Governance policy not found');
    }

    return policy;
  }

  async update(id: string, dto: UpdatePolicyDto) {
    await this.findOne(id);

    return this.prisma.governancePolicy.update({
      where: { id },
      data: dto,
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.governancePolicy.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.governancePolicy.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.governancePolicy.delete({
      where: { id },
    });
  }

  async stats() {
    const policies = await this.prisma.governancePolicy.findMany();

    const total = policies.length;
    const active = policies.filter((p) => p.isActive).length;

    const byCategory = policies.reduce((acc, policy) => {
      acc[policy.category] = (acc[policy.category] ?? 0) + 1;
      return acc;
    }, {});

    return {
      total,
      active,
      inactive: total - active,
      byCategory,
    };
  }
}
