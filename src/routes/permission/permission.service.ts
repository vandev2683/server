import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { PermissionRepo } from './permission.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreatePermissionBodyType, UpdatePermissionBodyType } from './permission.model'
import { isUniquePrismaError } from 'src/shared/helpers'

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepo) {}

  private async verifyPermissionExists(permissionId: number) {
    const permission = await this.permissionRepo.findById(permissionId)
    if (!permission) {
      throw new NotFoundException('Permission not found')
    }
    return permission
  }

  async list(pagination: PaginationQueryType) {
    return this.permissionRepo.list(pagination)
  }

  async findAll() {
    return this.permissionRepo.findAll()
  }

  async findById(permissionId: number) {
    return this.verifyPermissionExists(permissionId)
  }

  async create(data: CreatePermissionBodyType) {
    try {
      const permission = await this.permissionRepo.create(data)
      return permission
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Permission with method and path already exists')
      }
      throw error
    }
  }

  async update(permissionId: number, data: UpdatePermissionBodyType) {
    await this.verifyPermissionExists(permissionId)
    try {
      const permission = await this.permissionRepo.update(permissionId, data)
      return permission
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Permission with method and path already exists')
      }
      throw error
    }
  }

  async delete(permissionId: number) {
    await this.verifyPermissionExists(permissionId)
    await this.permissionRepo.delete(permissionId)
    return { message: 'Permission deleted successfully' }
  }
}
