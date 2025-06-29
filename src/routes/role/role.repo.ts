import { Injectable } from '@nestjs/common'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateRoleBodyType, UpdateRoleBodyType } from './role.model'

@Injectable()
export class RoleRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType) {
    const { limit, page } = pagination
    const skip = limit * (page - 1)
    const [roles, totalItems] = await Promise.all([
      this.prismaService.role.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.role.count()
    ])
    return {
      data: roles,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [roles, totalItems] = await Promise.all([
      this.prismaService.role.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.role.count()
    ])
    return {
      data: roles,
      totalItems
    }
  }

  async findById(roleId: number) {
    return await this.prismaService.role.findUnique({
      where: { id: roleId }
    })
  }

  async findDetail(roleId: number) {
    return await this.prismaService.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: true
      }
    })
  }

  async create(data: CreateRoleBodyType) {
    return await this.prismaService.role.create({
      data
    })
  }

  async update(roleId: number, data: UpdateRoleBodyType) {
    return await this.prismaService.role.update({
      where: { id: roleId },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        permissions: {
          set: data.permissionIds.map((id) => ({ id }))
        }
      }
    })
  }

  async delete(roleId: number) {
    return await this.prismaService.role.delete({
      where: { id: roleId }
    })
  }
}
