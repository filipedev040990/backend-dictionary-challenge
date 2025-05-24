import ImportDictionaryController from './import-dictionary.controller'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  importDictionaryUsecase: mock<ImportDictionaryUsecaseInterface>(),
}

const usecaseOutput = { status: 'processing' }

describe('ImportDictionaryController', () => {
  let sut: ImportDictionaryController

  beforeEach(() => {
    sut = new ImportDictionaryController(params)
    jest.spyOn(params.importDictionaryUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call ImportDictionaryUsecase.execute', async () => {
    await sut.execute()
    expect(params.importDictionaryUsecase.execute).toHaveBeenCalledTimes(1)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute()
    expect(output).toEqual({ statusCode: 200, body: usecaseOutput })
  })
})
