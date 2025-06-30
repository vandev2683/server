import { Injectable } from '@nestjs/common'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { ChangeCouponStatusBodyType, CreateCouponBodyType, UpdateCouponBodyType } from './coupon.model'

@Injectable()
export class CouponRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: PaginationQueryType) {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const [coupons, totalItems] = await Promise.all([
      this.prismaService.coupon.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.coupon.count()
    ])

    return {
      data: coupons,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [coupons, totalItems] = await Promise.all([
      this.prismaService.coupon.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.coupon.count()
    ])

    return {
      data: coupons,
      totalItems
    }
  }

  async findById(couponId: number) {
    return await this.prismaService.coupon.findUnique({
      where: { id: couponId }
    })
  }

  async create(data: CreateCouponBodyType) {
    return await this.prismaService.coupon.create({
      data
    })
  }

  async update(couponId: number, data: UpdateCouponBodyType) {
    return await this.prismaService.coupon.update({
      where: { id: couponId },
      data
    })
  }

  async changeStatus(couponId: number, data: ChangeCouponStatusBodyType) {
    return await this.prismaService.coupon.update({
      where: { id: couponId },
      data: { isActive: data.isActive }
    })
  }

  async delete(couponId: number) {
    return await this.prismaService.coupon.delete({
      where: { id: couponId }
    })
  }
}
