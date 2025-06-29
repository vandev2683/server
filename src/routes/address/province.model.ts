import { z } from 'zod'

export const ProvinceSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  nameEn: z.string().max(500),
  latitude: z.string().max(50),
  longitude: z.string().max(50)
})

export const ProvinceParamsSchema = z
  .object({
    provinceId: z.coerce.number().int().positive()
  })
  .strict()

export const GetProvincesResSchema = z.object({
  data: z.array(ProvinceSchema),
  totalItems: z.number()
})

export type ProvinceType = z.infer<typeof ProvinceSchema>
export type ProvinceParamsType = z.infer<typeof ProvinceParamsSchema>
export type GetProvincesResType = z.infer<typeof GetProvincesResSchema>
