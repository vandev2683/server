import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductRepo } from './product.repo'
import { ProductController } from './product.controller'
import { ManageProductService } from './manage-product.service'
import { ManageProductController } from './manage-product.controller'

@Module({
  controllers: [ProductController, ManageProductController],
  providers: [ProductService, ProductRepo, ManageProductService]
})
export class ProductModule {}
