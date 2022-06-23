import { faker } from '@faker-js/faker'
import { HttpModule } from '@nestjs/axios'
import { HttpException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { format } from 'date-fns'
import { DeleteResult, Repository } from 'typeorm'
import { CreateLocalDto } from './dto/createLocalDto.dto'
import { UpdateLocalDto } from './dto/updateLocalDto.dto'
import { Local } from './local.entity'
import { LocalService } from './local.service'

describe('LocalService', () => {
  let localService: LocalService
  let localrepository: Repository<Local>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalService,
        {
          provide: getRepositoryToken(Local),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
      imports: [HttpModule],
    }).compile()

    localService = module.get<LocalService>(LocalService)
    localrepository = module.get<Repository<Local>>(getRepositoryToken(Local))
  })

  it('should be defined', () => {
    expect(localService).toBeDefined()
    expect(localrepository).toBeDefined()
  })

  describe('createLocal Service', () => {
    it('should create a local with sucess', async () => {
      const flagUrlMocked = faker.internet.url()
      const dateFuteureMoked = faker.date.future()

      const createLocalDto: CreateLocalDto = {
        country: faker.address.country(),
        location: faker.address.cityName(),
        meta: dateFuteureMoked,
      }

      const result: Local = {
        id: faker.datatype.uuid(),
        ...createLocalDto,
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: flagUrlMocked,
      }

      const repoSpyCreate = jest
        .spyOn(localrepository, 'create')
        .mockImplementation((): Local => result)

      const repoSpySave = jest
        .spyOn(localrepository, 'save')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const repoSpyFindOneByCountryAndlocation = jest
        .spyOn(localService, 'findOneByCountryAndlocation')
        .mockImplementation((): Promise<Local> => Promise.resolve(null))

      const repoSpyGetFlagUrl = jest
        .spyOn(localService, 'getFlagUrl')
        .mockImplementation((): Promise<string> => Promise.resolve(flagUrlMocked))

      const repoSpyValidateDate = jest
        .spyOn(localService, 'validateDate')
        .mockImplementation((): Promise<Date> => Promise.resolve(dateFuteureMoked))

      const createdLocal = await localService.createLocal(createLocalDto)

      expect(createdLocal).toStrictEqual(result)
      expect(repoSpySave).toBeCalledTimes(1)
      expect(repoSpyCreate).toBeCalledTimes(1)
      expect(repoSpyFindOneByCountryAndlocation).toBeCalledTimes(1)
      expect(repoSpyGetFlagUrl).toBeCalledTimes(1)
      expect(repoSpyValidateDate).toBeCalledTimes(1)
    })

    it('should not create a local, ERROR with Duplicated Local', async () => {
      const flagUrlMocked = faker.internet.url()
      const dateFuteureMoked = faker.date.future()

      const createLocalDto: CreateLocalDto = {
        country: faker.address.country(),
        location: faker.address.cityName(),
        meta: dateFuteureMoked,
      }

      const result: Local = {
        id: faker.datatype.uuid(),
        ...createLocalDto,
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: flagUrlMocked,
      }

      const repoSpyCreate = jest
        .spyOn(localrepository, 'create')
        .mockImplementation((): Local => result)

      const repoSpySave = jest
        .spyOn(localrepository, 'save')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const repoSpyFindOneByCountryAndlocation = jest
        .spyOn(localService, 'findOneByCountryAndlocation')
        .mockImplementation((): Promise<Local> => Promise.resolve(result))

      const repoSpyGetFlagUrl = jest
        .spyOn(localService, 'getFlagUrl')
        .mockImplementation((): Promise<string> => Promise.resolve(flagUrlMocked))

      const repoSpyValidateDate = jest
        .spyOn(localService, 'validateDate')
        .mockImplementation((): Promise<Date> => Promise.resolve(dateFuteureMoked))

      try {
        await localService.createLocal(createLocalDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        if (error instanceof HttpException) {
          expect(error.message).toBe(`Local e Pais não pode ser adicionado de forma duplicada`)
        }
      }
      expect(repoSpyFindOneByCountryAndlocation).toBeCalledTimes(1)
      expect(repoSpyGetFlagUrl).toBeCalledTimes(0)
      expect(repoSpySave).toBeCalledTimes(0)
      expect(repoSpyCreate).toBeCalledTimes(0)
      expect(repoSpyValidateDate).toBeCalledTimes(0)
    })
  })

  describe('DeleteLocal()', () => {
    it('should delete a Local and return void ', async () => {
      const id = faker.datatype.uuid()

      const repoSpyDelete = jest
        .spyOn(localrepository, 'delete')
        .mockImplementation(async (): Promise<DeleteResult> => Promise.resolve({} as DeleteResult))

      await localService.deleteLocal(id)

      expect(repoSpyDelete).toBeCalledTimes(1)
    })
  })

  describe('updateLocal()', () => {
    it('should update a local and, return the updated Local ', async () => {
      const dateFuteureMoked = faker.date.future()
      const idMocked = faker.datatype.uuid()

      const oldLocal: Local = {
        id: idMocked,
        meta: faker.date.future(),
        location: faker.address.cityName(),
        country: faker.address.country(),
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      const updateLocalDto: UpdateLocalDto = {
        id: idMocked,
        location: faker.address.cityName(),
        meta: dateFuteureMoked,
      }

      const result: Local = {
        ...oldLocal,
        ...updateLocalDto,
      }

      const repoSpyFindOne = jest
        .spyOn(localrepository, 'findOne')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(oldLocal))

      const repoSpySave = jest
        .spyOn(localrepository, 'save')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const repoSpyFindOneByCountryAndlocation = jest
        .spyOn(localService, 'findOneByCountryAndlocation')
        .mockImplementation((): Promise<Local> => Promise.resolve(null))

      const repoSpyValidateDate = jest
        .spyOn(localService, 'validateDate')
        .mockImplementation((): Promise<Date> => Promise.resolve(dateFuteureMoked))

      const updatedLocal = await localService.updateLocal(updateLocalDto)

      expect(updatedLocal).toStrictEqual(result)

      expect(repoSpyFindOneByCountryAndlocation).toBeCalledTimes(1)
      expect(repoSpySave).toBeCalledTimes(1)
      expect(repoSpyFindOne).toBeCalledTimes(1)
      expect(repoSpyValidateDate).toBeCalledTimes(1)
    })

    it('should NOT update a local and, return ERROR not found old local ', async () => {
      const dateFuteureMoked = faker.date.future()
      const idMocked = faker.datatype.uuid()

      const oldLocal: Local = {
        id: idMocked,
        meta: faker.date.future(),
        location: faker.address.cityName(),
        country: faker.address.country(),
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      const updateLocalDto: UpdateLocalDto = {
        id: idMocked,
        location: faker.address.cityName(),
        meta: dateFuteureMoked,
      }

      const result: Local = {
        ...oldLocal,
        ...updateLocalDto,
      }

      const repoSpyFindOne = jest
        .spyOn(localrepository, 'findOne')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(null))

      const repoSpySave = jest
        .spyOn(localrepository, 'save')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const repoSpyFindOneByCountryAndlocation = jest
        .spyOn(localService, 'findOneByCountryAndlocation')
        .mockImplementation((): Promise<Local> => Promise.resolve(null))

      const repoSpyValidateDate = jest
        .spyOn(localService, 'validateDate')
        .mockImplementation((): Promise<Date> => Promise.resolve(dateFuteureMoked))

      try {
        await localService.updateLocal(updateLocalDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        if (error instanceof HttpException) {
          expect(error.message).toBe(`Nao foi encontrado Local com id:${idMocked}`)
        }
      }

      expect(repoSpyFindOneByCountryAndlocation).toBeCalledTimes(0)
      expect(repoSpySave).toBeCalledTimes(0)
      expect(repoSpyFindOne).toBeCalledTimes(1)
      expect(repoSpyValidateDate).toBeCalledTimes(0)
    })

    it('should NOT update a local and, return ERROR with Duplicated Local', async () => {
      const dateFuteureMoked = faker.date.future()
      const idMocked = faker.datatype.uuid()

      const oldLocal: Local = {
        id: idMocked,
        meta: faker.date.future(),
        location: faker.address.cityName(),
        country: faker.address.country(),
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      const updateLocalDto: UpdateLocalDto = {
        id: idMocked,
        location: faker.address.cityName(),
        meta: dateFuteureMoked,
      }

      const result: Local = {
        ...oldLocal,
        ...updateLocalDto,
      }

      const repoSpyFindOne = jest
        .spyOn(localrepository, 'findOne')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(oldLocal))

      const repoSpySave = jest
        .spyOn(localrepository, 'save')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const repoSpyFindOneByCountryAndlocation = jest
        .spyOn(localService, 'findOneByCountryAndlocation')
        .mockImplementation((): Promise<Local> => Promise.resolve({} as Local))

      const repoSpyValidateDate = jest
        .spyOn(localService, 'validateDate')
        .mockImplementation((): Promise<Date> => Promise.resolve(dateFuteureMoked))

      try {
        await localService.updateLocal(updateLocalDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        if (error instanceof HttpException) {
          expect(error.message).toBe(`Local e Pais não pode ser adicionado de forma duplicada`)
        }
      }

      expect(repoSpyFindOneByCountryAndlocation).toBeCalledTimes(1)
      expect(repoSpySave).toBeCalledTimes(0)
      expect(repoSpyFindOne).toBeCalledTimes(1)
      expect(repoSpyValidateDate).toBeCalledTimes(0)
    })
  })

  describe('GetAllLocals()', () => {
    it('should return array of locals ', async () => {
      const result: Local[] = [
        {
          id: faker.datatype.uuid(),
          country: faker.address.country(),
          location: faker.address.cityName(),
          meta: faker.date.future(),
          createdAt: faker.date.recent(),
          updateAt: faker.date.recent(),
          flagUrl: faker.internet.url(),
        },
        {
          id: faker.datatype.uuid(),
          country: faker.address.country(),
          location: faker.address.cityName(),
          meta: faker.date.future(),
          createdAt: faker.date.recent(),
          updateAt: faker.date.recent(),
          flagUrl: faker.internet.url(),
        },
        {
          id: faker.datatype.uuid(),
          country: faker.address.country(),
          location: faker.address.cityName(),
          meta: faker.date.future(),
          createdAt: faker.date.recent(),
          updateAt: faker.date.recent(),
          flagUrl: faker.internet.url(),
        },
      ]

      const repoSpyFindAndCount = jest
        .spyOn(localrepository, 'findAndCount')
        .mockImplementation(
          async (): Promise<[Local[], number]> => Promise.resolve([result, result.length]),
        )

      const localsWithTotal = await localService.getAllLocals()

      expect(localsWithTotal).toStrictEqual([result, result.length])
      expect(repoSpyFindAndCount).toBeCalledTimes(1)
    })
  })

  describe('validateDate()', () => {
    it('should Validate Date with sucess', async () => {
      const dateFutureMocked = faker.date.future()

      const dateValidated = await localService.validateDate(dateFutureMocked)

      expect(dateValidated).toStrictEqual(dateFutureMocked)
    })
    it('should Validate String Date with sucess', async () => {
      const dateFutureMocked = faker.date.future()

      const OnlyDayMonthYearDate = new Date(
        dateFutureMocked.getFullYear(),
        dateFutureMocked.getMonth(),
        dateFutureMocked.getDate(),
      )
      const dateFutureStringedMocked = format(dateFutureMocked, 'MM/dd/yyyy')

      const dateValidated = await localService.validateDate(dateFutureStringedMocked)

      expect(dateValidated).toStrictEqual(OnlyDayMonthYearDate)
    })

    it('should NOT Validate  Date, ERROR INVALID DATE', async () => {
      const dateFutureMocked = faker.random.word()

      try {
        await localService.validateDate(dateFutureMocked)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        if (error instanceof HttpException) {
          expect(error.message).toBe(`Data inválida.`)
        }
      }
    })

    it('should NOT Validate  Date, ERROR Past Date', async () => {
      const dateFutureMocked = faker.date.past()

      try {
        await localService.validateDate(dateFutureMocked)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        if (error instanceof HttpException) {
          expect(error.message).toBe(`Impossivel colocar data no passado.`)
        }
      }
    })
  })

  describe('findOneByCountryAndlocation()', () => {
    it('should find a local by Country and Location', async () => {
      const countryMocked = faker.address.country()
      const locationMocked = faker.address.cityName()

      const result = {
        id: faker.datatype.uuid(),
        country: countryMocked,
        location: locationMocked,
        meta: faker.date.future(),
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      const repoSpyFindOne = jest
        .spyOn(localrepository, 'findOne')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const findedLocal = await localService.findOneByCountryAndlocation(
        countryMocked,
        locationMocked,
      )

      expect(findedLocal).toStrictEqual(result)
      expect(repoSpyFindOne).toBeCalledTimes(1)
    })
  })
})
