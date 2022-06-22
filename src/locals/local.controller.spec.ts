import { Test, TestingModule } from '@nestjs/testing'
import { CreateLocalDto } from './dto/createLocalDto.dto'
import { LocalController } from './local.controller'
import { LocalService } from './local.service'
import { faker } from '@faker-js/faker'
import { Local } from './local.entity'
import { Response } from 'express'
import { UpdateLocalDto } from './dto/updateLocalDto.dto'

const responseMock = {
  status: jest.fn(x => ({
    status: x,
    json: jest.fn(x => x),
  })),
} as unknown as Response

describe('LocalController', () => {
  let localController: LocalController
  let localService: LocalService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalController],
      providers: [
        {
          provide: LocalService,
          useValue: {
            createLocal: jest.fn(),
            getAllLocals: jest.fn(),
            getCountryList: jest.fn(),
            deleteLocal: jest.fn(),
            updateLocal: jest.fn(),
          },
        },
      ],
    }).compile()

    localController = module.get<LocalController>(LocalController)
    localService = module.get<LocalService>(LocalService)
  })

  it('should be defined', () => {
    expect(localController).toBeDefined()
    expect(localService).toBeDefined()
  })

  describe('create()', () => {
    it('should create a local with sucess', async () => {
      const createLocalDto: CreateLocalDto = {
        country: faker.address.country(),
        location: faker.address.cityName(),
        meta: faker.date.future(),
      }

      const result: Local = {
        id: faker.datatype.uuid(),
        ...createLocalDto,
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      jest
        .spyOn(localService, 'createLocal')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const response = await localController.create(createLocalDto, responseMock)

      expect(response).toStrictEqual({ local: result })
    })
  })

  describe('findAll()', () => {
    it('should find all locals ', async () => {
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

      jest
        .spyOn(localService, 'getAllLocals')
        .mockImplementation(
          async (): Promise<[Local[], number]> => Promise.resolve([result, result.length]),
        )

      const response = await localController.findAll(responseMock)

      expect(response).toStrictEqual({ locals: result, total: result.length })
    })
  })

  describe('getCountryList()', () => {
    it('Should show country list', async () => {
      const result: string[] = [
        faker.address.country(),
        faker.address.country(),
        faker.address.country(),
      ]

      jest
        .spyOn(localService, 'getCountryList')
        .mockImplementation(async (): Promise<string[]> => Promise.resolve(result))

      const response = await localController.getCountryList(responseMock)

      expect(response).toStrictEqual({ countries: result })
    })
  })

  describe('update()', () => {
    it('should update a local with sucess', async () => {
      const idmocked = faker.datatype.uuid()
      const updateLocalDto: UpdateLocalDto = {
        location: faker.address.cityName(),
        meta: faker.date.future(),
      }

      const result: Local = {
        id: idmocked,
        country: faker.address.country(),
        ...updateLocalDto,
        createdAt: faker.date.recent(),
        updateAt: faker.date.recent(),
        flagUrl: faker.internet.url(),
      }

      jest
        .spyOn(localService, 'updateLocal')
        .mockImplementation(async (): Promise<Local> => Promise.resolve(result))

      const response = await localController.update(idmocked, updateLocalDto, responseMock)

      expect(response).toStrictEqual({ local: result })
    })
  })

  describe('delete()', () => {
    it('should delete a local with sucess', async () => {
      const idmocked = faker.datatype.uuid()

      jest
        .spyOn(localService, 'deleteLocal')
        .mockImplementation(async (): Promise<void> => Promise.resolve())

      const response = await localController.remove(idmocked, responseMock)

      expect(response.status).toStrictEqual(204)
    })
  })
})
