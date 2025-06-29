import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

type FindUniqueUserWhere = { id: number } | { email: string }

@Injectable()
export class SharedUserRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(where: FindUniqueUserWhere) {
    return await this.prismaService.user.findUnique({
      where
    })
  }
  async findUniqueWithRole(where: FindUniqueUserWhere) {
    return await this.prismaService.user.findUnique({
      where,
      include: {
        role: true
      }
    })
  }

  async update(userId: number, data: any) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data
    })
  }
}
