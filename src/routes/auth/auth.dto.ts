import { createZodDto } from 'nestjs-zod'
import {
  GoogleAuthResSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  ResetPasswordBodySchema,
  SendOTPBodySchema
} from './auth.model'

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LoginResDTO extends createZodDto(LoginResSchema) {}
export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
export class ResetPasswordBodyDTO extends createZodDto(ResetPasswordBodySchema) {}

export class GoogleAuthResDTO extends createZodDto(GoogleAuthResSchema) {}
