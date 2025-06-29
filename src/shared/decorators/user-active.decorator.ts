import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AccessTokenPayloadType } from '../types/token.t'
import { TokenService } from '../services/token.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../services/prisma.service'

const tokenService = new TokenService(new JwtService())
const prismaService = new PrismaService()

export const UserActive = createParamDecorator(
  async (field: keyof AccessTokenPayloadType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const accessToken = request.headers['authorization']?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required')
    }

    try {
      const payload = await tokenService.verifyAccessToken(accessToken)
      await prismaService.user.findUniqueOrThrow({
        where: {
          id: payload.userId
        }
      })
      return field ? payload[field] : payload
    } catch {
      throw new UnauthorizedException()
    }
  }
)
