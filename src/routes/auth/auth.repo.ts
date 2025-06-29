import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateRefreshTokenType, RegisterBodyType, VerificationCodeType } from './auth.model'
import { UserType } from 'src/shared/models/shared-user.model'

@Injectable()
export class AuthRepo {
  constructor(private readonly prismaService: PrismaService) {}

  // Area: Verification Code
  async findVerificationCode(
    payload: { id: number } | { email_code_type: Pick<VerificationCodeType, 'email' | 'code' | 'type'> }
  ) {
    return await this.prismaService.verificationCode.findUnique({
      where: payload
    })
  }
  async createVerificationCode(data: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>) {
    return await this.prismaService.verificationCode.create({
      data
    })
  }
  async deleteVerificationCode(
    payload: { id: number } | { email_code_type: Pick<VerificationCodeType, 'email' | 'code' | 'type'> }
  ) {
    return await this.prismaService.verificationCode.delete({
      where: payload
    })
  }

  // Area: Refresh Token
  async findRefreshToken(token: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        token
      }
    })
  }
  async findRefreshTokenWithUserRole(token: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        token
      },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })
  }
  async createRefreshToken(data: CreateRefreshTokenType) {
    return await this.prismaService.refreshToken.create({
      data
    })
  }
  async deleteRefreshToken(token: string) {
    return await this.prismaService.refreshToken.delete({
      where: {
        token
      }
    })
  }

  // Area: Auth of User: Login, Register, Logout, Reset Password
  async createUser(
    data: Pick<RegisterBodyType, 'email' | 'password' | 'name' | 'phoneNumber'> & Pick<UserType, 'roleId'>
  ) {
    return await this.prismaService.user.create({
      data,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }

  async updateUser(
    where: Pick<UserType, 'id'> | Pick<UserType, 'email'>,
    data: Partial<Omit<UserType, 'id' | 'email'>>
  ) {
    return await this.prismaService.user.update({
      where,
      data
    })
  }
}
