import { createZodDto } from 'nestjs-zod'
import {
  CouponParamsSchema,
  CouponSchema,
  CreateCouponBodySchema,
  GetAllCouponsResSchema,
  GetCouponsResSchema,
  UpdateCouponBodySchema
} from './coupon.model'

export class CouponResDTO extends createZodDto(CouponSchema) {}
export class CouponParamsDTO extends createZodDto(CouponParamsSchema) {}
export class GetCouponsResDTO extends createZodDto(GetCouponsResSchema) {}
export class GetAllCouponsResDTO extends createZodDto(GetAllCouponsResSchema) {}
export class CreateCouponBodyDTO extends createZodDto(CreateCouponBodySchema) {}
export class UpdateCouponBodyDTO extends createZodDto(UpdateCouponBodySchema) {}
