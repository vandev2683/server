import { createZodDto } from 'nestjs-zod'
import { UserSchema } from 'src/shared/models/shared-user.model'
import {
  ChangePasswordBodySchema,
  ChangeUserStatusBodySchema,
  CreateUserBodySchema,
  GetAllUsersResSchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
  UserParamsSchema
} from './user.model'

export class UserResDTO extends createZodDto(UserSchema) {}
export class UserParamsDTO extends createZodDto(UserParamsSchema) {}
export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}
export class GetAllUsersResDTO extends createZodDto(GetAllUsersResSchema) {}
export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}
export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}
export class ChangePasswordBodyDTO extends createZodDto(ChangePasswordBodySchema) {}
export class ChangeUserStatusBodyDTO extends createZodDto(ChangeUserStatusBodySchema) {}
