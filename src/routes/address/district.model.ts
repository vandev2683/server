import { z } from 'zod'

export const DistrictSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  nameEn: z.string().max(500),
  latitude: z.string().max(50),
  longitude: z.string().max(50),
  provinceId: z.number()
})

export const DistrictParamsSchema = z
  .object({
    districtId: z.coerce.number().int().positive()
  })
  .strict()

export const GetDistrictsResSchema = z.object({
  data: z.array(DistrictSchema),
  totalItems: z.number()
})

export type DistrictType = z.infer<typeof DistrictSchema>
export type DistrictParamsType = z.infer<typeof DistrictParamsSchema>
export type GetDistrictsResType = z.infer<typeof GetDistrictsResSchema>
