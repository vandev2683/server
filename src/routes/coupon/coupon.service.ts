import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { CouponRepo } from './coupon.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { ChangeCouponStatusBodyType, CreateCouponBodyType, UpdateCouponBodyType } from './coupon.model'
import { isUniquePrismaError } from 'src/shared/helpers'

@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponRepo) {}

  private async verifyCouponExists(couponId: number) {
    const coupon = await this.couponRepo.findById(couponId)
    if (!coupon) {
      throw new NotFoundException('Coupon not found')
    }
    return coupon
  }

  async list(query: PaginationQueryType) {
    return await this.couponRepo.list(query)
  }

  async findAll() {
    return await this.couponRepo.findAll()
  }

  async findById(couponId: number) {
    return await this.verifyCouponExists(couponId)
  }

  async create(data: CreateCouponBodyType) {
    try {
      const coupon = await this.couponRepo.create(data)
      return coupon
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Coupon code already exists')
      }
      throw error
    }
  }

  async update(couponId: number, data: UpdateCouponBodyType) {
    await this.verifyCouponExists(couponId)
    try {
      const coupon = await this.couponRepo.update(couponId, data)
      return coupon
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Coupon code already exists')
      }
      throw error
    }
  }

  async changeStatus(couponId: number, data: ChangeCouponStatusBodyType) {
    await this.verifyCouponExists(couponId)
    await this.couponRepo.changeStatus(couponId, data)
    return { message: 'Coupon status updated successfully' }
  }

  async delete(couponId: number) {
    await this.verifyCouponExists(couponId)
    await this.couponRepo.delete(couponId)
    return { message: 'Coupon deleted successfully' }
  }
}
