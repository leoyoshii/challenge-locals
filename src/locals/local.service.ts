import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Local } from './local.entity'
import { CreateLocalDto } from './dto/createLocalDto.dto'
import { UpdateLocalDto } from './dto/updateLocalDto.dto'
import { Repository } from 'typeorm'
import { HttpService } from '@nestjs/axios'
import { IRestCountryResponse } from './interface/IrestCountryResponse'

@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Local)
    private localRepository: Repository<Local>,
    private readonly httpService: HttpService,
  ) {}

  async createLocal({ country, location, meta }: CreateLocalDto): Promise<Local> {
    const checkCountryAndLocation = await this.findOneByCountryAndlocation(country, location)

    if (checkCountryAndLocation) {
      throw new HttpException(
        'Local e Pais não pode ser adicionado de forma duplicada',
        HttpStatus.CONFLICT,
      )
    }

    const flagUrl = await this.getFlagUrl(country)

    const validatedDate = await this.validateDate(meta)

    const localToAdd = this.localRepository.create({
      country,
      location,
      meta: validatedDate,
      flagUrl,
    })

    return this.localRepository.save(localToAdd)
  }

  async deleteLocal(id: string): Promise<void> {
    const deleted = await this.localRepository.delete(id)

    if (deleted.affected === 0) {
      throw new HttpException(`Nao foi encontrado Local com id:${id}`, HttpStatus.NOT_FOUND)
    }
    return
  }

  async updateLocal({ id, location, meta }: UpdateLocalDto): Promise<Local> {
    const findedLocal = await this.localRepository.findOne({ where: { id } })

    if (!findedLocal) {
      throw new HttpException(`Nao foi encontrado Local com id:${id}`, HttpStatus.NOT_FOUND)
    }

    if (location !== findedLocal.location) {
      const checkCountryAndLocation = await this.findOneByCountryAndlocation(
        findedLocal.country,
        location,
      )

      if (checkCountryAndLocation) {
        throw new HttpException(
          'Local e Pais não pode ser adicionado de forma duplicada',
          HttpStatus.CONFLICT,
        )
      }
    }

    const validatedDate = await this.validateDate(meta)

    findedLocal.location = location && location
    findedLocal.meta = meta && validatedDate

    return this.localRepository.save(findedLocal)
  }

  async getAllLocals(): Promise<[Local[], number]> {
    return await this.localRepository.findAndCount({ order: { meta: 'ASC' } })
  }

  //Para inserir no <Select/> de País da tela sugerida.
  async getCountryList(): Promise<string[]> {
    const { data } = await this.httpService.axiosRef.get<IRestCountryResponse[]>(
      `https://restcountries.com/v3.1/all/`,
    )

    return data
      .map(restCountry => restCountry.translations.por.common)
      .sort((a, b) => a.localeCompare(b, 'pt-br', { sensitivity: 'base' }))
  }

  //utils
  async getFlagUrl(country: string): Promise<string> {
    const { data } = await this.httpService.axiosRef
      .get<IRestCountryResponse[]>(`https://restcountries.com/v3.1/translation/${country}`)
      .catch(() => {
        throw new HttpException('País não encontrado', HttpStatus.NOT_FOUND)
      })

    if (data.length > 1) {
      throw new HttpException('Tente ser mais específico', HttpStatus.BAD_REQUEST)
    }

    return data[0].flags.png
  }

  async validateDate(date: Date | string): Promise<Date> {
    const metaDate = new Date(date)

    const today = new Date()

    if (isNaN(metaDate.getTime())) {
      throw new HttpException('Data inválida.', HttpStatus.BAD_REQUEST)
    }

    if (metaDate < today) {
      throw new HttpException('Impossivel colocar data no passado.', HttpStatus.BAD_REQUEST)
    }

    return metaDate
  }

  async findOneByCountryAndlocation(country: string, location: string): Promise<Local | undefined> {
    return await this.localRepository.findOne({ where: { country, location } })
  }
}
