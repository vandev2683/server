import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoryRepo } from './category.repo'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from './category.model'
import { PaginationQueryType } from 'src/shared/models/request.model'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  private async verifyCategoryExists(categoryId: number) {
    const category = await this.categoryRepo.findById(categoryId)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async list(query: PaginationQueryType) {
    return await this.categoryRepo.list(query)
  }

  async findAll() {
    return await this.categoryRepo.findAll()
  }

  async findDetail(categoryId: number) {
    const category = await this.categoryRepo.findDetail(categoryId)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async create(data: CreateCategoryBodyType) {
    if (data.parentCategoryId) {
      await this.verifyCategoryExists(data.parentCategoryId)
    }
    return await this.categoryRepo.create(data)
  }

  async update(categoryId: number, data: UpdateCategoryBodyType) {
    await this.verifyCategoryExists(categoryId)
    if (data.parentCategoryId) {
      if (data.parentCategoryId === categoryId) {
        throw new Error('A category cannot be its own parent')
      }
      await this.verifyCategoryExists(data.parentCategoryId)
    }

    return await this.categoryRepo.update(categoryId, data)
  }

  async delete(categoryId: number) {
    await this.verifyCategoryExists(categoryId)
    await this.categoryRepo.delete(categoryId)
    return {
      message: 'Category deleted successfully'
    }
  }
}
