import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateTableBodyType, UpdateTableBodyType } from './table.model'
import { PaginationQueryType } from 'src/shared/models/request.model'

@Injectable()
export class TableRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: PaginationQueryType) {
    const { page, limit } = query
    const skip = limit * (page - 1)
    const [tables, totalItems] = await Promise.all([
      this.prismaService.table.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.table.count()
    ])

    return {
      data: tables,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [tables, totalItems] = await Promise.all([
      this.prismaService.table.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.table.count()
    ])

    return {
      data: tables,
      totalItems
    }
  }

  async findById(tableId: number) {
    return await this.prismaService.table.findUnique({
      where: { id: tableId }
    })
  }

  async findDetail(tableId: number) {
    return await this.prismaService.table.findUnique({
      where: { id: tableId },
      include: {
        orders: true,
        bookings: true
      }
    })
  }

  async create(data: CreateTableBodyType) {
    return await this.prismaService.table.create({
      data
    })
  }

  async update(tableId: number, data: UpdateTableBodyType) {
    return await this.prismaService.table.update({
      where: { id: tableId },
      data
    })
  }

  async delete(tableId: number) {
    return await this.prismaService.table.delete({
      where: { id: tableId }
    })
  }
}
