import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  CategoryParamsDTO,
  CategoryResDTO,
  CategoryWithParentResDTO,
  CreateCategoryBodyDTO,
  GetAllCategoriesResDTO,
  GetCategoryDetailResDTO,
  UpdateCategoryBodyDTO
} from './category.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ZodSerializerDto(CategoryWithParentResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.categoryService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllCategoriesResDTO)
  findAll() {
    return this.categoryService.findAll()
  }

  @Get(':categoryId')
  @ZodSerializerDto(GetCategoryDetailResDTO)
  findDetail(@Param() params: CategoryParamsDTO) {
    return this.categoryService.findDetail(params.categoryId)
  }

  @Post()
  @ZodSerializerDto(CategoryResDTO)
  create(@Body() body: CreateCategoryBodyDTO) {
    return this.categoryService.create(body)
  }

  @Put(':categoryId')
  @ZodSerializerDto(CategoryResDTO)
  update(@Param() params: CategoryParamsDTO, @Body() body: UpdateCategoryBodyDTO) {
    return this.categoryService.update(params.categoryId, body)
  }

  @Delete(':categoryId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: CategoryParamsDTO) {
    return this.categoryService.delete(params.categoryId)
  }
}
