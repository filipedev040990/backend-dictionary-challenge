import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class ImportDictionaryController implements ControllerInterface {
  private readonly loggerService: LoggerServiceInterface
  private readonly importDictionaryUsecase: ImportDictionaryUsecaseInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
    this.importDictionaryUsecase = params.importDictionaryUsecase
  }

  async execute(): Promise<HttpResponse> {
    try {
      const output = await this.importDictionaryUsecase.execute()
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('Importing dictionary error', { error: formattedError })
      return formattedError
    }
  }
}
