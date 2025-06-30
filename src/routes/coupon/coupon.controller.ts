import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { CouponService } from './coupon.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  ChangeCouponStatusBodyDTO,
  CouponParamsDTO,
  CouponResDTO,
  CreateCouponBodyDTO,
  GetAllCouponsResDTO,
  GetCouponsResDTO,
  UpdateCouponBodyDTO
} from './coupon.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ZodSerializerDto(GetCouponsResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.couponService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllCouponsResDTO)
  findAll() {
    return this.couponService.findAll()
  }

  @Get(':couponId')
  @ZodSerializerDto(CouponResDTO)
  findById(@Param() params: CouponParamsDTO) {
    return this.couponService.findById(params.couponId)
  }

  @Post()
  @ZodSerializerDto(CouponResDTO)
  create(@Body() body: CreateCouponBodyDTO) {
    return this.couponService.create(body)
  }

  @Put(':couponId')
  @ZodSerializerDto(CouponResDTO)
  update(@Param() params: CouponParamsDTO, @Body() body: UpdateCouponBodyDTO) {
    return this.couponService.update(params.couponId, body)
  }

  @Patch(':couponId/change-status')
  @ZodSerializerDto(MessageResDTO)
  changeStatus(@Param() params: CouponParamsDTO, @Body() body: ChangeCouponStatusBodyDTO) {
    return this.couponService.changeStatus(params.couponId, body)
  }

  @Delete(':couponId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: CouponParamsDTO) {
    return this.couponService.delete(params.couponId)
  }
}
