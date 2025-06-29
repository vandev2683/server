import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './services/token.service'
import { UtilService } from './services/util.service'
import { SharedUserRepo } from './repositories/shared-user.repo'
import { S3Service } from './services/s3.service'
import { OtpService } from './services/otp.service'
import { AccessTokenGuard } from './guards/access-token.guard'
import { PaymentAPIKeyGuard } from './guards/payment-api-key.guard'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication.guard'
import { SharedRoleRepo } from './repositories/shared-role.repo'

const sharedServices = [PrismaService, TokenService, UtilService, S3Service, OtpService]
const sharedRepositories = [SharedUserRepo, SharedRoleRepo]

@Global()
@Module({
  imports: [JwtModule],
  exports: [...sharedServices, ...sharedRepositories],
  providers: [
    ...sharedServices,
    ...sharedRepositories,
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    }
  ]
})
export class SharedModule {}
