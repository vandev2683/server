import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  ChangeRoleStatusBodyDTO,
  CreateRoleBodyDTO,
  GetAllRolesResDTO,
  GetRoleDetailResDTO,
  GetRolesResDTO,
  RoleParamsDTO,
  RoleResDTO,
  UpdateRoleBodyDTO
} from './role.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetRolesResDTO)
  list(@Query() pagination: PaginationQueryDTO) {
    return this.roleService.list(pagination)
  }

  @Get('all')
  @ZodSerializerDto(GetAllRolesResDTO)
  findAll() {
    return this.roleService.findAll()
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  findDetail(@Param() params: RoleParamsDTO) {
    return this.roleService.findDetail(params.roleId)
  }

  @Post()
  @ZodSerializerDto(RoleResDTO)
  create(@Body() body: CreateRoleBodyDTO) {
    return this.roleService.create(body)
  }

  @Put(':roleId')
  @ZodSerializerDto(RoleResDTO)
  update(@Param() params: RoleParamsDTO, @Body() body: UpdateRoleBodyDTO) {
    return this.roleService.update(params.roleId, body)
  }

  @Patch(':roleId/change-status')
  @ZodSerializerDto(MessageResDTO)
  changeStatus(@Param() params: RoleParamsDTO, @Body() body: ChangeRoleStatusBodyDTO) {
    return this.roleService.changeStatus(params.roleId, body)
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: RoleParamsDTO) {
    return this.roleService.delete(params.roleId)
  }
}
