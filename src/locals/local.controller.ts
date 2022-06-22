import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common'

import { Response } from 'express'
import { CreateLocalDto } from './dto/createLocalDto'
import { UpdateLocalDto } from './dto/updateLocalDto'
import { Local } from './local.entity'
import { LocalService } from './local.service'

@Controller('locals')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  async create(@Body() data: CreateLocalDto, @Res() response: Response): Promise<void> {
    const local = await this.localService.createLocal(data)
    response.status(HttpStatus.CREATED).json({ local })
  }

  @Get()
  async findAll(@Res() response: Response): Promise<void> {
    const [locals, total] = await this.localService.getAllLocals()
    response.status(HttpStatus.OK).json({ locals, total })
  }
  @Get('/countries')
  async getCountryList(@Res() response: Response): Promise<void> {
    const countries = await this.localService.getCountryList()
    response.status(HttpStatus.OK).json({ countries })
  }

  @Put(':id')
  async findOne(
    @Param('id') id: string,
    @Body() data: UpdateLocalDto,
    @Res() response: Response,
  ): Promise<void> {
    const local = await this.localService.updateLocal({ id, ...data })
    response.status(HttpStatus.OK).json({ local })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response): Promise<void> {
    await this.localService.deleteLocal(id)
    response.status(HttpStatus.NO_CONTENT)
  }
}
