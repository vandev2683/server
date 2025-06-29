import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { TableService } from './table.service'
import {
  CreateTableBodyDTO,
  GetAllTablesResDTO,
  GetTableDetailResDTO,
  GetTablesResDTO,
  TableParamsDTO,
  TableResDTO,
  UpdateTableBodyDTO
} from './table.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  @ZodSerializerDto(GetTablesResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.tableService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllTablesResDTO)
  findAll() {
    return this.tableService.findAll()
  }

  @Get(':tableId')
  @ZodSerializerDto(GetTableDetailResDTO)
  findDetail(@Param() params: TableParamsDTO) {
    return this.tableService.findDetail(params.tableId)
  }

  @Post()
  @ZodSerializerDto(TableResDTO)
  create(@Body() body: CreateTableBodyDTO) {
    return this.tableService.create(body)
  }

  @Put(':tableId')
  @ZodSerializerDto(TableResDTO)
  update(@Param() params: TableParamsDTO, @Body() body: UpdateTableBodyDTO) {
    return this.tableService.update(params.tableId, body)
  }

  @Delete(':tableId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: TableParamsDTO) {
    return this.tableService.delete(params.tableId)
  }
}
