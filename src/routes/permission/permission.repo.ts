import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreatePermissionBodyType, UpdatePermissionBodyType } from './permission.model'

@Injectable()
export class PermissionRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType) {
    const { limit, page } = pagination
    const skip = limit * (page - 1)

    const [data, totalItems] = await Promise.all([
      this.prismaService.permission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.permission.count()
    ])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [permissions, totalItems] = await Promise.all([
      this.prismaService.permission.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.permission.count()
    ])

    return {
      data: permissions,
      totalItems
    }
  }

  async findById(permissionId: number) {
    return this.prismaService.permission.findUnique({
      where: { id: permissionId }
    })
  }

  async create(data: CreatePermissionBodyType) {
    return this.prismaService.permission.create({
      data
    })
  }

  async update(permissionId: number, data: UpdatePermissionBodyType) {
    return this.prismaService.permission.update({
      where: { id: permissionId },
      data
    })
  }

  async delete(permissionId: number) {
    return this.prismaService.permission.delete({
      where: { id: permissionId }
    })
  }
}
