import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import envConfig from '../config'

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const paymentApiKey = request.headers['authorization']?.split(' ')[1]
    if (!paymentApiKey) {
      return false
    }
    if (paymentApiKey !== envConfig.PAYMENT_API_KEY_SECRET) {
      return false
    }
    return true
  }
}
