import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Local } from './local.entity'
import { CreateLocalDto } from './dto/createLocalDto'
import { UpdateLocalDto } from './dto/updateLocalDto'
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

  async findOneByCountryAndlocation(country: string, location: string): Promise<Local | undefined> {
    return await this.localRepository.findOne({ where: { country, location } })
  }

  async createLocal({ country, location, meta }: CreateLocalDto): Promise<Local> {
    const flagUrl = await this.getFlagUrl(country)

    const checkCountryAndLocation = await this.findOneByCountryAndlocation(country, location)

    const validatedDate = await this.validateDate(meta)

    if (checkCountryAndLocation) {
      throw new HttpException(
        'Local e Pais não pode ser adicionado de forma duplicada',
        HttpStatus.CONFLICT,
      )
    }

    const localToAdd = this.localRepository.create({
      country,
      location,
      meta: validatedDate,
      flagUrl,
    })

    return this.localRepository.save(localToAdd)
  }

  async deleteLocal(id: string): Promise<void> {
    await this.localRepository.delete(id)
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

    findedLocal.location = location && location
    findedLocal.meta = meta && meta

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
  private async getFlagUrl(country: string): Promise<string> {
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

  private async validateDate(date: Date | string): Promise<Date> {
    const metaDate = new Date(date)

    console.log(metaDate)

    const today = new Date()

    if (isNaN(metaDate.getTime())) {
      throw new HttpException('Data inválida.', HttpStatus.BAD_REQUEST)
    }

    if (metaDate < today) {
      throw new HttpException('Impossivel colocar data no passado.', HttpStatus.BAD_REQUEST)
    }

    return metaDate
  }
}