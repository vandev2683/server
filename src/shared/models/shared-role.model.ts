import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  description: z.string().default(''),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
})
