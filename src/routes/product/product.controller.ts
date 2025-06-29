import { Body, Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { Public } from 'src/shared/decorators/auth.decorator'
import {
  GetAllProductsResDTO,
  GetProductDetailResDTO,
  GetProductsResDTO,
  ProductParamsDTO,
  ProductQueryDTO
} from './product.dto'

@Controller('products')
@Public()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() query: ProductQueryDTO) {
    return this.productService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllProductsResDTO)
  findAll() {
    return this.productService.findAll()
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  findDetail(@Param() params: ProductParamsDTO) {
    return this.productService.findDetail(params.productId)
  }
}
