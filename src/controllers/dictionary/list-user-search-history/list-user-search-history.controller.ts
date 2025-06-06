import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ListUserSearchHistoryUsecaseInput, ListUserSearchHistoryUsecaseInterface } from '@/domain/usecases/dictionary/list-user-search-history-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class ListUserSearchHistoryController implements ControllerInterface {
  private readonly loggerService: LoggerServiceInterface
  private readonly listUserSearchHistoryUsecase: ListUserSearchHistoryUsecaseInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
    this.listUserSearchHistoryUsecase = params.listUserSearchHistoryUsecase
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const usecaseInput: ListUserSearchHistoryUsecaseInput = {
        userId: input?.body?.userData?.id,
        limit: input?.query?.limit,
        page: input?.query?.page,
      }
      const output = await this.listUserSearchHistoryUsecase.execute(usecaseInput)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('Listing user search history error', { error: formattedError })
      return formattedError
    }
  }
}
