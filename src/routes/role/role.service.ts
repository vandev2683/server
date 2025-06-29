import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { RoleRepo } from './role.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreateRoleBodyType, RoleType, UpdateRoleBodyType } from './role.model'
import { isNotFoundPrismaError, isUniquePrismaError } from 'src/shared/helpers'
import { RoleName } from 'src/shared/constants/role.constant'

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  private async verifyRoleExists(roleId: number) {
    const role = await this.roleRepo.findById(roleId)
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    return role
  }

  private verifyAdminRole(role: RoleType) {
    if (role.name === RoleName.Admin) {
      throw new UnauthorizedException('Cannot modify admin role')
    }
  }

  async list(pagination: PaginationQueryType) {
    return this.roleRepo.list(pagination)
  }

  async findAll() {
    return this.roleRepo.findAll()
  }

  async findDetail(roleId: number) {
    const role = await this.roleRepo.findDetail(roleId)
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    return role
  }

  async create(data: CreateRoleBodyType) {
    try {
      const role = await this.roleRepo.create(data)
      return role
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Role with this name already exists')
      }
      throw error
    }
  }

  async update(roleId: number, data: UpdateRoleBodyType) {
    const existRole = await this.verifyRoleExists(roleId)
    this.verifyAdminRole(existRole)
    try {
      const role = await this.roleRepo.update(roleId, data)
      return role
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Permission not found')
      }
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Role with this name already exists')
      }
      throw error
    }
  }

  async delete(roleId: number) {
    const existRole = await this.verifyRoleExists(roleId)
    this.verifyAdminRole(existRole)
    await this.roleRepo.delete(roleId)
    return { message: 'Role deleted successfully' }
  }
}
