import { createZodDto } from 'nestjs-zod'
import {
  AddressParamsSchema,
  AddressSchema,
  AddressWithLocationSchema,
  CreateAddressBodySchema,
  GetAddressesResSchema,
  UpdateAddressBodySchema
} from './address.model'

export class AddressResDTO extends createZodDto(AddressSchema) {}

export class AddressWithLocationResDTO extends createZodDto(AddressWithLocationSchema) {}

export class AddressParamsDTO extends createZodDto(AddressParamsSchema) {}

export class GetAddressesResDTO extends createZodDto(GetAddressesResSchema) {}

export class CreateAddressBodyDTO extends createZodDto(CreateAddressBodySchema) {}

export class UpdateAddressBodyDTO extends createZodDto(UpdateAddressBodySchema) {}
