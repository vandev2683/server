import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { TagRepo } from './tag.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreateTagBodyType, UpdateTagBodyType } from './tag.model'
import { isUniquePrismaError } from 'src/shared/helpers'

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepo) {}

  private async verifyTagExists(tagId: number) {
    const tag = await this.tagRepo.findById(tagId)
    if (!tag) {
      throw new NotFoundException('Tag not found')
    }
    return tag
  }

  async list(query: PaginationQueryType) {
    return await this.tagRepo.list(query)
  }

  async findAll() {
    return await this.tagRepo.findAll()
  }

  async findById(tagId: number) {
    return await this.verifyTagExists(tagId)
  }

  async create(data: CreateTagBodyType) {
    try {
      return await this.tagRepo.create(data)
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Tag already exists')
      }
      throw error
    }
  }

  async update(tagId: number, data: UpdateTagBodyType) {
    await this.verifyTagExists(tagId)
    return await this.tagRepo.update(tagId, data)
  }

  async delete(id: number) {
    await this.verifyTagExists(id)
    await this.tagRepo.delete(id)
    return { message: 'Tag deleted successfully' }
  }
}
