import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import ListUserSearchHistoryController from './list-user-search-history.controller'
import { mock } from 'jest-mock-extended'
import { ListUserSearchHistoryUsecaseInterface, ListUserSearchHistoryUsecaseOutput } from '@/domain/usecases/dictionary/list-user-search-history-usecase.interface'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  listUserSearchHistoryUsecase: mock<ListUserSearchHistoryUsecaseInterface>(),
}

const usecaseOutput: ListUserSearchHistoryUsecaseOutput = {
  results: [
    {
      word: 'fireman',
      added: new Date('2024-01-04'),
    },
    {
      word: 'fireproof',
      added: new Date('2024-01-05'),
    },
    {
      word: 'fireball',
      added: new Date('2024-01-06'),
    },
  ],
  page: 2,
  totalDocs: 25,
  totalPages: 9,
  hasNext: true,
  hasPrev: true,
}

describe('ListUserSearchHistoryController', () => {
  let sut: ListUserSearchHistoryController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListUserSearchHistoryController(params)
    input = {
      query: {
        limit: 4,
        page: 1,
      },
      body: {
        userData: {
          id: 'anyUserId',
          name: 'anyName',
          username: 'anyUsername',
        },
      },
    }
    jest.spyOn(params.listUserSearchHistoryUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call listUserSearchHistoryUsecase.execute', async () => {
    await sut.execute(input)
    expect(params.listUserSearchHistoryUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.listUserSearchHistoryUsecase.execute).toHaveBeenCalledWith({
      userId: input.body.userData.id,
      ...input.query,
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: usecaseOutput })
  })
})
