import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import { AuthRepo } from './auth.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  ResetPasswordBodyType,
  SendOTPBodyType,
  VerificationCodeType
} from './auth.model'
import { TokenService } from 'src/shared/services/token.service'
import { VerificationCode } from 'src/shared/constants/auth.constant'
import { OtpService } from 'src/shared/services/otp.service'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'
import ms from 'ms'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { isUniquePrismaError } from 'src/shared/helpers'
import { UtilService } from 'src/shared/services/util.service'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { v4 as uuidv4 } from 'uuid'
import { RoleName } from 'src/shared/constants/role.constant'

@Injectable()
export class AuthService {
  private oAuth2Client: OAuth2Client

  constructor(
    private readonly authRepo: AuthRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly utilService: UtilService
  ) {
    this.oAuth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI
    )
  }

  private async verifyVerificationCodeExists(payload: Pick<VerificationCodeType, 'email' | 'code' | 'type'>) {
    const verificationCode = await this.authRepo.findVerificationCode({
      email_code_type: payload
    })
    if (!verificationCode) {
      throw new NotFoundException('Verification code not found')
    }
    if (verificationCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException('Verification code has expired')
    }
    return verificationCode
  }

  private async verifyRefreshTokenExists(token: string) {
    const refreshToken = await this.authRepo.findRefreshToken(token)
    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found')
    }
    if (refreshToken.expiresAt < new Date()) {
      throw new UnprocessableEntityException('Refresh token has expired')
    }
    return refreshToken
  }

  async sendOTP(body: SendOTPBodyType) {
    // 1. Kiểm tra email đã tồn tại hay chưa
    const user = await this.sharedUserRepo.findUnique({
      email: body.email
    })
    if (body.type === VerificationCode.Register && user) {
      throw new UnprocessableEntityException('Email already exists')
    }
    if (body.type === VerificationCode.ForgotPassword && !user) {
      throw new NotFoundException('User not found')
    }
    // 2. Tạo mã OTP
    const code = this.otpService.generateOTP()
    await this.authRepo.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN))
    })

    // 3. Gửi mã OTP
    const { error } = await this.otpService.sendOTP({
      to: body.email,
      subject: body.type === VerificationCode.Register ? 'Verify your email' : 'Reset your password',
      code
    })
    if (error) {
      throw new UnprocessableEntityException('Send OTP failed')
    }
    return { message: 'Sent OTP successfully' }
  }

  async refreshToken(data: RefreshTokenBodyType) {
    try {
      const decodedRefreshToken = await this.tokenService.verifyRefreshToken(data.refreshToken)
      const tokenInDb = await this.authRepo.findRefreshTokenWithUserRole(data.refreshToken)
      if (!tokenInDb) {
        throw new NotFoundException('Refresh token not found')
      }

      const [accessToken, refreshToken] = await this.tokenService.signAccessAndRefreshToken({
        userId: tokenInDb.userId,
        roleId: tokenInDb.user.roleId,
        roleName: tokenInDb.user.role.name,
        exp: decodedRefreshToken.exp
      })

      await this.authRepo.deleteRefreshToken(data.refreshToken)

      const { exp } = await this.tokenService.verifyRefreshToken(refreshToken)
      await this.authRepo.createRefreshToken({
        userId: tokenInDb.userId,
        token: refreshToken,
        expiresAt: new Date(exp * 1000) // Date:ms and exp:s
      })

      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnauthorizedException()
    }
  }

  async register(data: RegisterBodyType) {
    const verificationCodePayload = { email: data.email, code: data.code, type: VerificationCode.Register }
    await this.verifyVerificationCodeExists(verificationCodePayload)
    try {
      const [hashedPassword, clientRoleId] = await Promise.all([
        this.utilService.hash(data.password),
        this.sharedRoleRepo.getClientRoleId()
      ])
      await Promise.all([
        this.authRepo.createUser({
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phoneNumber: data.phoneNumber,
          roleId: clientRoleId
        }),
        this.authRepo.deleteVerificationCode({
          email_code_type: verificationCodePayload
        })
      ])
      return { message: 'Register successful' }
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Email already exists')
      }
      throw error
    }
  }

  async login(data: LoginBodyType) {
    const user = await this.sharedUserRepo.findUniqueWithRole({ email: data.email })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const isValidPassword = await this.utilService.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new UnprocessableEntityException('Invalid password')
    }
    const [accessToken, refreshToken] = await this.tokenService.signAccessAndRefreshToken({
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name
    })

    const { userId, exp } = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepo.createRefreshToken({
      userId,
      token: refreshToken,
      expiresAt: new Date(exp * 1000) // Date:ms and exp:s
    })

    return {
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        status: user.status,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role
      }
    }
  }

  async logout(token: string) {
    try {
      await this.tokenService.verifyRefreshToken(token)
      await this.verifyRefreshTokenExists(token)
      await this.authRepo.deleteRefreshToken(token)
      return { message: 'Logout successful' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnauthorizedException()
    }
  }

  async forgotPassword(data: ResetPasswordBodyType) {
    await this.verifyVerificationCodeExists({
      email: data.email,
      code: data.code,
      type: VerificationCode.ForgotPassword
    })
    try {
      const hashedPassword = await this.utilService.hash(data.password)
      await this.authRepo.updateUser({ email: data.email }, { password: hashedPassword })
      return { message: 'Reset password successful' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new BadRequestException()
    }
  }

  generateAuthUrl() {
    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      include_granted_scopes: true
    })

    return {
      url
    }
  }

  async googleCallback(code: string) {
    try {
      const { tokens } = await this.oAuth2Client.getToken(code)
      this.oAuth2Client.setCredentials(tokens)

      const oauth2 = google.oauth2({ version: 'v2', auth: this.oAuth2Client })
      const { data } = await oauth2.userinfo.get()

      if (!data.email) {
        throw new UnauthorizedException('Google account does not have an email')
      }

      const user = await this.sharedUserRepo.findUnique({ email: data.email })
      if (!user) {
        const clientRoleId = await this.sharedRoleRepo.getClientRoleId()
        const hashedPassword = await this.utilService.hash(uuidv4())

        const newUser = await this.authRepo.createUser({
          email: data.email,
          password: hashedPassword,
          name: data.name ?? '',
          phoneNumber: '',
          roleId: clientRoleId
        })

        const [accessToken, refreshToken] = await this.tokenService.signAccessAndRefreshToken({
          userId: newUser.id,
          roleId: newUser.roleId,
          roleName: RoleName.Client
        })

        const { exp } = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.authRepo.createRefreshToken({
          userId: newUser.id,
          token: refreshToken,
          expiresAt: new Date(exp * 1000) // Date:ms and exp:s
        })
        return {
          accessToken,
          refreshToken
        }
      } else {
        const [accessToken, refreshToken] = await this.tokenService.signAccessAndRefreshToken({
          userId: user.id,
          roleId: user.roleId,
          roleName: RoleName.Client
        })

        const { exp } = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.authRepo.createRefreshToken({
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(exp * 1000) // Date:ms and exp:s
        })
        return {
          accessToken,
          refreshToken
        }
      }
    } catch {
      throw new Error('Google authentication failed')
    }
  }
}
