import { VerificationCode } from 'src/shared/constants/auth.constant'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.nativeEnum(VerificationCode),
  expiresAt: z.date(),
  createdAt: z.date()
})

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true
}).strict()

export const RefreshTokenSchema = z.object({
  id: z.number(),
  userId: z.number(),
  token: z.string().max(1000),
  expiresAt: z.date(),
  createdAt: z.date()
})

export const CreateRefreshTokenSchema = RefreshTokenSchema.pick({
  userId: true,
  token: true,
  expiresAt: true
})

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export const RefreshTokenResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
})

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  password: true
})
  .extend({
    confirmPassword: z.string(),
    code: z.string().length(6)
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Confirm password does not match'
      })
    }
  })

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true
}).strict()

export const LoginResSchema = z.object({
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  user: UserSchema.omit({
    password: true,
    totpSecret: true
  }).extend({
    role: RoleSchema.pick({
      id: true,
      name: true
    })
  })
})

export const RegisterResSchema = LoginBodySchema

export const LogoutBodySchema = RefreshTokenBodySchema

export const ResetPasswordBodySchema = UserSchema.pick({
  email: true,
  password: true
})
  .extend({
    code: z.string().length(6),
    confirmPassword: z.string()
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Confirm password does not match',
        path: ['confirmPassword']
      })
    }
  })

export const GoogleAuthResSchema = z.object({
  url: z.string()
})

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>

export type CreateRefreshTokenType = z.infer<typeof CreateRefreshTokenSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type LogoutBodyType = z.infer<typeof LogoutBodySchema>
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBodySchema>

export type GoogleAuthResType = z.infer<typeof GoogleAuthResSchema>
