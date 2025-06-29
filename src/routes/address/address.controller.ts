import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common'
import { AddressService } from './address.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  AddressParamsDTO,
  AddressResDTO,
  AddressWithLocationResDTO,
  CreateAddressBodyDTO,
  GetAddressesResDTO,
  UpdateAddressBodyDTO
} from './address.dto'
import { UserActive } from 'src/shared/decorators/user-active.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ZodSerializerDto(GetAddressesResDTO)
  findAll(@UserActive('userId') userId: number) {
    return this.addressService.findAll(userId)
  }

  @Get(':addressId')
  @ZodSerializerDto(AddressWithLocationResDTO)
  findById(@Param() params: AddressParamsDTO) {
    return this.addressService.findDetailById(params.addressId)
  }
  @Post()
  @ZodSerializerDto(AddressResDTO)
  create(@UserActive('userId') userId: number, @Body() body: CreateAddressBodyDTO) {
    return this.addressService.create(userId, body)
  }

  @Put(':addressId')
  @ZodSerializerDto(AddressResDTO)
  update(@Param() params: AddressParamsDTO, @Body() body: UpdateAddressBodyDTO) {
    return this.addressService.update(params.addressId, body)
  }

  @Delete(':addressId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: AddressParamsDTO) {
    return this.addressService.delete(params.addressId)
  }
}
