import { createZodDto } from 'nestjs-zod'
import { ProductSchema } from 'src/shared/models/shared-product.model'
import {
  CreateProductBodySchema,
  GetAllProductsResSchema,
  GetProductDetailResSchema,
  GetProductsResSchema,
  ProductParamsSchema,
  ProductQuerySchema,
  UpdateProductBodySchema
} from './product.model'

export class ProductResDTO extends createZodDto(ProductSchema) {}
export class ProductParamsDTO extends createZodDto(ProductParamsSchema) {}
export class ProductQueryDTO extends createZodDto(ProductQuerySchema) {}
export class GetProductsResDTO extends createZodDto(GetProductsResSchema) {}
export class GetAllProductsResDTO extends createZodDto(GetAllProductsResSchema) {}
export class GetProductDetailResDTO extends createZodDto(GetProductDetailResSchema) {}
export class CreateProductBodyDTO extends createZodDto(CreateProductBodySchema) {}
export class UpdateProductBodyDTO extends createZodDto(UpdateProductBodySchema) {}
