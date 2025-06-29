import { z } from 'zod'

export const WardSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  nameEn: z.string().max(500),
  latitude: z.string().max(50),
  longitude: z.string().max(50),
  districtId: z.number()
})

export const WardParamsSchema = z
  .object({
    wardId: z.coerce.number().int().positive()
  })
  .strict()

export const GetWardsResSchema = z.object({
  data: z.array(WardSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export type WardType = z.infer<typeof WardSchema>
export type WardParamsType = z.infer<typeof WardParamsSchema>
export type GetWardsResType = z.infer<typeof GetWardsResSchema>
