import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { UserRepo } from './user.repo'
import { UtilService } from 'src/shared/services/util.service'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { isNotFoundPrismaError, isUniquePrismaError } from 'src/shared/helpers'
import { ChangePasswordBodyType, CreateUserBodyType, UpdateUserBodyType } from './user.model'
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

  async changePassword(data: ChangePasswordBodyType) {
    await this.verifyUserExists(data.userId)
    try {
      const hashedPassword = await this.utilService.hash(data.newPassword)
      await this.userRepo.changePassword({
        userId: data.userId,
        newPassword: hashedPassword
      })
      return { message: 'Password changed successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('User not found or password is incorrect')
      }
      throw error
    }
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
