import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { TableRepo } from './table.repo'
import { ChangeTableStatusBodyType, CreateTableBodyType, UpdateTableBodyType } from './table.model'
import { isUniquePrismaError } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/models/request.model'

@Injectable()
export class TableService {
  constructor(private readonly tableRepo: TableRepo) {}

  private async verifyTableExists(tableId: number) {
    const table = await this.tableRepo.findById(tableId)
    if (!table) {
      throw new NotFoundException('Table not found')
    }
    return table
  }

  async list(query: PaginationQueryType) {
    return await this.tableRepo.list(query)
  }

  async findAll() {
    return await this.tableRepo.findAll()
  }

  async findDetail(tableId: number) {
    const table = await this.tableRepo.findDetail(tableId)
    if (!table) {
      throw new NotFoundException('Table not found')
    }
    return table
  }

  async create(data: CreateTableBodyType) {
    try {
      const table = await this.tableRepo.create(data)
      return table
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Table code already exists')
      }
      throw error
    }
  }

  async update(tableId: number, data: UpdateTableBodyType) {
    await this.verifyTableExists(tableId)
    try {
      const table = await this.tableRepo.update(tableId, data)
      return table
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Table code already exists')
      }
      throw error
    }
  }

  async changeStatus(tableId: number, data: ChangeTableStatusBodyType) {
    await this.verifyTableExists(tableId)
    await this.tableRepo.changeStatus(tableId, data)
    return { message: 'Table status updated successfully' }
  }

  async delete(tableId: number) {
    await this.verifyTableExists(tableId)
    await this.tableRepo.delete(tableId)
    return { message: 'Table deleted successfully' }
  }
}
