import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ListWordsUsecaseInput, ListWordsUsecaseInterface } from '@/domain/usecases/dictionary/list-words-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class ListWordsController implements ControllerInterface {
  private readonly loggerService: LoggerServiceInterface
  private readonly listWordsUsecase: ListWordsUsecaseInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
    this.listWordsUsecase = params.listWordsUsecase
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const usecaseInput: ListWordsUsecaseInput = {
        search: input?.query?.search,
        limit: input?.query?.limit,
        page: input?.query?.page,
      }
      const output = await this.listWordsUsecase.execute(usecaseInput)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('Listing words error', { error: formattedError })
      return formattedError
    }
  }
}
