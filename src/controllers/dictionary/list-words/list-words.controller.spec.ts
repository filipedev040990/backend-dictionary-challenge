import { HttpRequest } from '@/domain/controller/controller.interface'
import ListWordsController from './list-words.controller'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ListWordsUsecaseInterface, ListWordsUsecaseOutput } from '@/domain/usecases/dictionary/list-words-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  listWordsUsecase: mock<ListWordsUsecaseInterface>(),
}

const usecaseOutput: ListWordsUsecaseOutput = {
  results: ['firehouse', 'firebreak', 'fireballer', 'fireboat'],
  page: 1,
  totalDocs: 21,
  totalPages: 6,
  hasNext: true,
  hasPrev: false,
}

describe('ListWordsController', () => {
  let sut: ListWordsController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListWordsController(params)
    input = {
      query: {
        search: 'fire',
        limit: 4,
        page: 1,
      },
    }
    jest.spyOn(params.listWordsUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call listWordsUsecase.execute', async () => {
    await sut.execute(input)
    expect(params.listWordsUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.listWordsUsecase.execute).toHaveBeenCalledWith(input.query)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: usecaseOutput })
  })
})
