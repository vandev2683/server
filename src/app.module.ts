import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RoleModule } from './routes/role/role.module'
import { SharedModule } from './shared/shared.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipe'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { TagModule } from './routes/tag/tag.module'
import { CategoryModule } from './routes/category/category.module'
import { TableModule } from './routes/table/table.module'
import { CouponModule } from './routes/coupon/coupon.module'
import { PermissionModule } from './routes/permission/permission.module'
import { UserModule } from './routes/user/user.module'
import { ProductModule } from './routes/product/product.module'
import { AuthModule } from './routes/auth/auth.module'
import { MediaModule } from './routes/media/media.module'

@Module({
  imports: [
    SharedModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    TagModule,
    CategoryModule,
    TableModule,
    CouponModule,
    UserModule,
    ProductModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
