import { RoleSchema } from 'src/shared/models/shared-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const UserWithRoleSchema = UserSchema.extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
    isActive: true
  })
})

export const UserParamsSchema = z.object({
  userId: z.coerce.number().int().positive()
})

export const GetUsersResSchema = z.object({
  data: z.array(UserWithRoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetAllUsersResSchema = GetUsersResSchema.pick({
  data: true,
  totalItems: true
})

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  dateOfBirth: true,
  status: true,
  roleId: true
}).strict()

export const UpdateUserBodySchema = CreateUserBodySchema.omit({
  email: true,
  password: true
}).strict()

export const ChangePasswordBodySchema = z
  .object({
    userId: z.coerce.number().int().positive(),
    newPassword: z.string().min(3).max(100)
  })
  .strict()

export type UserType = z.infer<typeof UserSchema>
export type UserWithRoleType = z.infer<typeof UserWithRoleSchema>
export type UserParamsType = z.infer<typeof UserParamsSchema>
export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetAllUsersResType = z.infer<typeof GetAllUsersResSchema>
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
