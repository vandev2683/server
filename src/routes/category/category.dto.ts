import { createZodDto } from 'nestjs-zod'
import {
  CategoryParamsSchema,
  CategoryWithParentSchema,
  CreateCategoryBodySchema,
  GetAllCategoriesResSchema,
  GetCategoriesResSchema,
  GetCategoryDetailResSchema,
  UpdateCategoryBodySchema
} from './category.model'
import { CategorySchema } from 'src/shared/models/shared-category.model'

export class CategoryResDTO extends createZodDto(CategorySchema) {}
export class CategoryWithParentResDTO extends createZodDto(CategoryWithParentSchema) {}
export class CategoryParamsDTO extends createZodDto(CategoryParamsSchema) {}
export class GetCategoriesResDTO extends createZodDto(GetCategoriesResSchema) {}
export class GetAllCategoriesResDTO extends createZodDto(GetAllCategoriesResSchema) {}
export class GetCategoryDetailResDTO extends createZodDto(GetCategoryDetailResSchema) {}
export class CreateCategoryBodyDTO extends createZodDto(CreateCategoryBodySchema) {}
export class UpdateCategoryBodyDTO extends createZodDto(UpdateCategoryBodySchema) {}
