import { Injectable } from '@nestjs/common'
import { ProductRepo } from './product.repo'
import { ProductQueryType } from './product.model'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async list(query: ProductQueryType) {
    return await this.productRepo.list(query)
  }

  async findAll() {
    return await this.productRepo.findAll()
  }

  async findDetail(productId: number) {
    return await this.productRepo.findDetail(productId)
  }
}
