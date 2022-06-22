import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateLocalDto } from './dto/createLocalDto.dto'
import { UpdateLocalDto } from './dto/updateLocalDto.dto'
import { LocalService } from './local.service'

@ApiTags('locals')
@Controller('locals')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo lugar' })
  @ApiBody({ type: CreateLocalDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Criado com sucesso.',
  })
  async create(@Body() data: CreateLocalDto, @Res() response: Response): Promise<void> {
    const local = await this.localService.createLocal(data)
    response.status(HttpStatus.CREATED).json({ local })
  }

  @Get()
  @ApiOperation({ summary: 'Listar lugares' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado com sucesso.',
  })
  async findAll(@Res() response: Response): Promise<void> {
    const [locals, total] = await this.localService.getAllLocals()
    response.status(HttpStatus.OK).json({ locals, total })
  }
  @Get('/countries')
  @ApiOperation({ summary: 'Listar possiveis paises' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado com sucesso.',
  })
  async getCountryList(@Res() response: Response): Promise<void> {
    const countries = await this.localService.getCountryList()
    response.status(HttpStatus.OK).json({ countries })
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza lugar pelo id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '300709e2-dd6e-4b2c-a0ce-3db1a0cce6b6',
  })
  @ApiBody({ type: UpdateLocalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Atualizado com Sucesso.',
  })
  async findOne(
    @Param('id') id: string,
    @Body() data: UpdateLocalDto,
    @Res() response: Response,
  ): Promise<void> {
    const local = await this.localService.updateLocal({ id, ...data })
    response.status(HttpStatus.OK).json({ local })
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta lugar pelo id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '300709e2-dd6e-4b2c-a0ce-3db1a0cce6b6',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No content.',
  })
  async remove(@Param('id') id: string, @Res() response: Response): Promise<void> {
    await this.localService.deleteLocal(id)
    response.status(HttpStatus.NO_CONTENT)
  }
}
