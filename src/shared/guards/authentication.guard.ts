/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_GUARD_KEY, AuthGuardMetaType } from '../decorators/auth.decorator'
import { AuthCondition, AuthGuard } from '../constants/auth.constant'
import { AccessTokenGuard } from './access-token.guard'
import { PaymentAPIKeyGuard } from './payment-api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly paymentApiKeyGuard: PaymentAPIKeyGuard
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenObj = this.reflector.getAllAndOverride<AuthGuardMetaType | undefined>(AUTH_GUARD_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? { guardType: [AuthGuard.Bearer], options: { condition: 'And' } }
    try {
      const guardsMap: Record<keyof typeof AuthGuard, CanActivate> = {
        Bearer: this.accessTokenGuard,
        PaymentAPIKey: this.paymentApiKeyGuard,
        None: {
          canActivate: (context: ExecutionContext) => true
        }
      }

      const guards = authenObj.guardType.map((guard) => {
        return guardsMap[guard]
      })
      if (authenObj.options.condition === AuthCondition.Or) {
        for (const guard of guards) {
          const isActive = await guard.canActivate(context)
          if (isActive) {
            return true
          }
        }
        throw new UnauthorizedException()
      } else {
        for (const guard of guards) {
          const isActive = await guard.canActivate(context)
          if (!isActive) {
            throw new UnauthorizedException()
          }
        }
        return true
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnauthorizedException()
    }
  }
}
