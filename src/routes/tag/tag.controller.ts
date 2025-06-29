import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TagService } from './tag.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { CreateTagBodyDTO, GetAllTagsResDTO, GetTagsResDTO, TagParamsDTO, TagResDTO, UpdateTagBodyDTO } from './tag.dto'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ZodSerializerDto(GetTagsResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.tagService.list(query)
  }

  @Get('all')
  @ZodSerializerDto(GetAllTagsResDTO)
  findAll() {
    return this.tagService.findAll()
  }

  @Get(':tagId')
  @ZodSerializerDto(TagResDTO)
  findById(@Param() params: TagParamsDTO) {
    return this.tagService.findById(params.tagId)
  }

  @Post()
  @ZodSerializerDto(TagResDTO)
  create(@Body() body: CreateTagBodyDTO) {
    return this.tagService.create(body)
  }

  @Put(':tagId')
  @ZodSerializerDto(TagResDTO)
  update(@Param() params: TagParamsDTO, @Body() body: UpdateTagBodyDTO) {
    return this.tagService.update(params.tagId, body)
  }

  @Delete(':tagId')
  @ZodSerializerDto(MessageResDTO)
  async delete(@Param() params: TagParamsDTO) {
    await this.tagService.delete(params.tagId)
  }
}
