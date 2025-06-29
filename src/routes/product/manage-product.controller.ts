import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ManageProductService } from './manage-product.service'
import {
  CreateProductBodyDTO,
  GetAllProductsResDTO,
  GetProductDetailResDTO,
  GetProductsResDTO,
  ProductParamsDTO,
  ProductQueryDTO,
  ProductResDTO,
  UpdateProductBodyDTO
} from './product.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('manage-products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() query: ProductQueryDTO) {
    return this.manageProductService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllProductsResDTO)
  findAll() {
    return this.manageProductService.findAll()
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  findDetail(@Param() params: ProductParamsDTO) {
    return this.manageProductService.findDetail(params.productId)
  }

  @Post()
  @ZodSerializerDto(ProductResDTO)
  create(@Body() body: CreateProductBodyDTO) {
    return this.manageProductService.create(body)
  }

  @Put(':productId')
  @ZodSerializerDto(ProductResDTO)
  update(@Param() params: ProductParamsDTO, @Body() body: UpdateProductBodyDTO) {
    return this.manageProductService.update(params.productId, body)
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: ProductParamsDTO) {
    return this.manageProductService.delete(params.productId)
  }
}
