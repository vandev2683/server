import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepo } from './product.repo'
import {
  ChangeProductStatusBodyType,
  CreateProductBodyType,
  ProductQueryType,
  UpdateProductBodyType
} from './product.model'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { S3Service } from 'src/shared/services/s3.service'

@Injectable()
export class ManageProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly s3Service: S3Service
  ) {}

  private async verifyProductExists(productId: number) {
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return product
  }

  async list(query: ProductQueryType) {
    return await this.productRepo.list(query)
  }

  async findAll() {
    return await this.productRepo.findAll()
  }

  async findDetail(productId: number) {
    const product = await this.productRepo.findDetail(productId)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return product
  }

  async create(data: CreateProductBodyType) {
    try {
      const basePrice = data.variants[0].price
      const product = await this.productRepo.create({ ...data, basePrice })
      return product
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('One or more categories or tags not found')
      }
      throw error
    }
  }

  async update(productId: number, data: UpdateProductBodyType) {
    const existingProduct = await this.verifyProductExists(productId)
    try {
      const basePrice = data.variants[0].price
      const product = await this.productRepo.update(productId, { ...data, basePrice })
      if (product.images) {
        const oldImages = existingProduct.images.filter((image) => !product.images.includes(image))
        await this.s3Service.deleteFiles(oldImages)
      }
      return product
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('One or more categories or tags not found')
      }
      throw error
    }
  }

  async changeStatus(productId: number, data: ChangeProductStatusBodyType) {
    await this.verifyProductExists(productId)
    await this.productRepo.changeStatus(productId, data)
    return { message: 'Product status updated successfully' }
  }

  async delete(productId: number) {
    const product = await this.verifyProductExists(productId)
    await this.productRepo.delete(productId)
    if (product.images) {
      await this.s3Service.deleteFiles(product.images)
    }
    return { message: 'Product deleted successfully' }
  }
}
