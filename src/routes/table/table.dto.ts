import { createZodDto } from 'nestjs-zod'
import {
  CreateTableBodySchema,
  GetAllTablesResSchema,
  GetTableDetailResSchema,
  GetTablesResSchema,
  TableParamsSchema,
  TableSchema,
  UpdateTableBodySchema
} from './table.model'

export class TableResDTO extends createZodDto(TableSchema) {}
export class TableParamsDTO extends createZodDto(TableParamsSchema) {}
export class GetTablesResDTO extends createZodDto(GetTablesResSchema) {}
export class GetAllTablesResDTO extends createZodDto(GetAllTablesResSchema) {}
export class GetTableDetailResDTO extends createZodDto(GetTableDetailResSchema) {}
export class CreateTableBodyDTO extends createZodDto(CreateTableBodySchema) {}
export class UpdateTableBodyDTO extends createZodDto(UpdateTableBodySchema) {}
