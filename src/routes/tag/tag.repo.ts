import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreateTagBodyType, UpdateTagBodyType } from './tag.model'

@Injectable()
export class TagRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: PaginationQueryType) {
    const { limit, page } = query
    const skip = limit * (page - 1)

    const [tags, totalItems] = await Promise.all([
      this.prismaService.tag.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.tag.count()
    ])

    return {
      data: tags,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [tags, totalItems] = await Promise.all([
      this.prismaService.tag.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.tag.count()
    ])
    return {
      data: tags,
      totalItems
    }
  }

  async findById(tagId: number) {
    return await this.prismaService.tag.findUnique({
      where: { id: tagId }
    })
  }

  async create(data: CreateTagBodyType) {
    return await this.prismaService.tag.create({ data })
  }

  async update(tagId: number, data: UpdateTagBodyType) {
    return await this.prismaService.tag.update({
      where: { id: tagId },
      data
    })
  }

  async delete(tagId: number) {
    return await this.prismaService.tag.delete({
      where: { id: tagId }
    })
  }
}
