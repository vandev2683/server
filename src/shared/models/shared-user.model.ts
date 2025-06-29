import { z } from 'zod'
import { UserStatus } from '../constants/user.constant'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email('Email không hợp lệ').max(500, 'Email tối đa 500 ký tự'),
  password: z.string().min(3, 'Mật khẩu tối thiểu 3 ký tự').max(500, 'Mật khẩu tối đa 500 ký tự'),
  roleId: z.coerce.number(),
  name: z.string().max(500, 'Tên tối đa 500 ký tự').default(''),
  phoneNumber: z.string().max(50, 'Số điện thoại tối đa 50 ký tự').default(''),
  avatar: z.string().max(1000, 'Avatar không hợp lệ').nullable(),
  dateOfBirth: z.coerce.date({ message: 'Ngày sinh không hợp lệ' }).nullable(),
  totpSecret: z.string().max(1000).nullable(),
  status: z.nativeEnum(UserStatus, { message: 'Trạng thái không hợp lệ' }).default(UserStatus.Active),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type UserType = z.infer<typeof UserSchema>
