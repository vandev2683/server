import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  ChangePasswordBodyDTO,
  ChangeUserStatusBodyDTO,
  CreateUserBodyDTO,
  GetAllUsersResDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UserParamsDTO,
  UserResDTO
} from './user.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.userService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllUsersResDTO)
  findAll() {
    return this.userService.findAll()
  }

  @Get(':userId')
  @ZodSerializerDto(UserResDTO)
  findById(@Param() params: UserParamsDTO) {
    return this.userService.findById(params.userId)
  }

  @Post()
  @ZodSerializerDto(UserResDTO)
  create(@Body() body: CreateUserBodyDTO) {
    return this.userService.create(body)
  }

  @Put(':userId')
  @ZodSerializerDto(UserResDTO)
  update(@Param() params: UserParamsDTO, @Body() body: UpdateUserBodyDTO) {
    return this.userService.update(params.userId, body)
  }

  @Patch(':userId/change-password')
  @ZodSerializerDto(MessageResDTO)
  changePassword(@Param() params: UserParamsDTO, @Body() body: ChangePasswordBodyDTO) {
    return this.userService.changePassword(params.userId, body)
  }

  @Patch(':userId/change-status')
  @ZodSerializerDto(MessageResDTO)
  async changeStatus(@Param() params: UserParamsDTO, @Body() body: ChangeUserStatusBodyDTO) {
    await this.userService.changeStatus(params.userId, body)
    return {
      message: 'User status updated successfully'
    }
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  async delete(@Param() params: UserParamsDTO) {
    await this.userService.delete(params.userId)
    return {
      message: 'User deleted successfully'
    }
  }
}
