import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from './category.model'

@Injectable()
export class CategoryRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: PaginationQueryType) {
    const { page, limit } = query
    const skip = limit * (page - 1)
    const [categories, totalItems] = await Promise.all([
      this.prismaService.category.findMany({
        include: {
          parentCategory: true
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.category.count()
    ])

    return {
      data: categories,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [categories, totalItems] = await Promise.all([
      this.prismaService.category.findMany({
        include: {
          parentCategory: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prismaService.category.count()
    ])
    return {
      data: categories,
      totalItems
    }
  }

  async findById(categoryId: number) {
    return await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })
  }

  async findDetail(categoryId: number) {
    return await this.prismaService.category.findUnique({
      where: { id: categoryId },
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true
          }
        },
        childCategories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  async create(data: CreateCategoryBodyType) {
    return await this.prismaService.category.create({
      data
    })
  }

  async update(categoryId: number, data: UpdateCategoryBodyType) {
    return await this.prismaService.category.update({
      where: { id: categoryId },
      data
    })
  }

  async delete(categoryId: number) {
    await this.prismaService.category.delete({
      where: { id: categoryId }
    })
  }
}
