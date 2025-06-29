import { z } from 'zod'
import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'

export const RoleParamsSchema = z
  .object({
    roleId: z.coerce.number().int().positive()
  })
  .strict()

export const GetRolesResSchema = z.object({
  data: z.array(RoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetAllRolesResSchema = GetRolesResSchema.pick({
  data: true,
  totalItems: true
})

export const GetRoleDetailResSchema = RoleSchema.extend({
  permissions: z.array(
    PermissionSchema.omit({
      createdAt: true,
      updatedAt: true
    })
  )
})

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true
}).strict()

export const UpdateRoleBodySchema = CreateRoleBodySchema.extend({
  permissionIds: z.array(z.number())
}).strict()

export type RoleType = z.infer<typeof RoleSchema>
export type RoleParamsType = z.infer<typeof RoleParamsSchema>
export type GetRolesResType = z.infer<typeof GetRolesResSchema>
export type GetAllRolesResType = z.infer<typeof GetAllRolesResSchema>
export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>
