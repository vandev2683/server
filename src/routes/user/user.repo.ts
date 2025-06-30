import { Injectable } from '@nestjs/common'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { ChangePasswordBodyType, ChangeUserStatusBodyType, CreateUserBodyType, UpdateUserBodyType } from './user.model'

@Injectable()
export class UserRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: PaginationQueryType) {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const [users, totalItems] = await Promise.all([
      this.prismaService.user.findMany({
        include: {
          role: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.user.count()
    ])

    return {
      data: users,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [users, totalItems] = await Promise.all([
      this.prismaService.user.findMany({
        include: {
          role: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.user.count()
    ])
    return {
      data: users,
      totalItems
    }
  }

  async findById(userId: number) {
    return await this.prismaService.user.findUnique({
      where: { id: userId }
    })
  }

  async create(data: CreateUserBodyType) {
    return await this.prismaService.user.create({
      data
    })
  }

  async update(userId: number, data: UpdateUserBodyType) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data
    })
  }

  async changePassword(userId: number, data: ChangePasswordBodyType) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: data.password
      }
    })
  }

  async changeStatus(userId: number, data: ChangeUserStatusBodyType) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { status: data.status }
    })
  }

  async delete(userId: number) {
    return await this.prismaService.user.delete({
      where: { id: userId }
    })
  }
}
