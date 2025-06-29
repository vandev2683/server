import { z } from 'zod'
import { ProvinceSchema } from './province.model'
import { DistrictSchema } from './district.model'
import { WardSchema } from './ward.model'

export const AddressSchema = z.object({
  id: z.number(),
  userId: z.number(),
  recipientName: z.string().max(500),
  recipientPhone: z.string().max(50),
  provinceId: z.number(),
  districtId: z.number(),
  wardId: z.number(),
  detailAddress: z.string().max(1000),
  deliveryNote: z.string().max(1000).default(''),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const AddressWithLocationSchema = AddressSchema.extend({
  province: ProvinceSchema,
  district: DistrictSchema,
  ward: WardSchema
})

export const AddressParamsSchema = z
  .object({
    addressId: z.coerce.number().int().positive()
  })
  .strict()

export const GetAddressesResSchema = z.object({
  data: z.array(AddressWithLocationSchema),
  totalItems: z.number()
})

export const CreateAddressBodySchema = AddressSchema.pick({
  recipientName: true,
  recipientPhone: true,
  provinceId: true,
  districtId: true,
  wardId: true,
  detailAddress: true,
  deliveryNote: true,
  isDefault: true
}).strict()

export const UpdateAddressBodySchema = CreateAddressBodySchema.strict()

export type AddressType = z.infer<typeof AddressSchema>
export type AddressWithLocationType = z.infer<typeof AddressWithLocationSchema>
export type AddressParamsType = z.infer<typeof AddressParamsSchema>
export type GetAddressesResType = z.infer<typeof GetAddressesResSchema>
export type CreateAddressBodyType = z.infer<typeof CreateAddressBodySchema>
export type UpdateAddressBodyType = z.infer<typeof UpdateAddressBodySchema>
