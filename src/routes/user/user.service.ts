import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { UserRepo } from './user.repo'
import { UtilService } from 'src/shared/services/util.service'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { isUniquePrismaError } from 'src/shared/helpers'
import { ChangePasswordBodyType, ChangeUserStatusBodyType, CreateUserBodyType, UpdateUserBodyType } from './user.model'
import { S3Service } from 'src/shared/services/s3.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly utilService: UtilService,
    private readonly s3Service: S3Service
  ) {}

  private async verifyUserExists(userId: number) {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async list(query: PaginationQueryType) {
    return await this.userRepo.list(query)
  }

  async findAll() {
    return await this.userRepo.findAll()
  }

  async findById(userId: number) {
    return await this.verifyUserExists(userId)
  }

  async create(data: CreateUserBodyType) {
    try {
      const hashedPassword = await this.utilService.hash(data.password)
      const user = await this.userRepo.create({
        ...data,
        password: hashedPassword
      })
      return user
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Email already exists')
      }
      throw error
    }
  }

  async update(userId: number, data: UpdateUserBodyType) {
    await this.verifyUserExists(userId)
    try {
      const user = await this.userRepo.update(userId, data)
      return user
    } catch (error) {
      if (isUniquePrismaError(error)) {
        throw new UnprocessableEntityException('Email already exists')
      }
      throw error
    }
  }

  async changePassword(userId: number, data: ChangePasswordBodyType) {
    await this.verifyUserExists(userId)
    const hashedPassword = await this.utilService.hash(data.password)
    await this.userRepo.changePassword(userId, {
      password: hashedPassword
    })
    return { message: 'Password changed successfully' }
  }

  async changeStatus(userId: number, data: ChangeUserStatusBodyType) {
    await this.verifyUserExists(userId)
    await this.userRepo.changeStatus(userId, data)
    return { message: 'User status updated successfully' }
  }

  async delete(userId: number) {
    const user = await this.verifyUserExists(userId)
    await this.userRepo.delete(userId)
    if (user.avatar) {
      await this.s3Service.deleteFiles([user.avatar])
    }
    return { message: 'User deleted successfully' }
  }
}
