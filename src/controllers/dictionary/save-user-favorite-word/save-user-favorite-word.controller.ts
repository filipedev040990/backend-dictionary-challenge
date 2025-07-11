import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { SaveUserFavoriteWordUsecaseInput, SaveUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/save-user-favorite-word-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class SaveUserFavoriteWordController implements ControllerInterface {
  private readonly loggerService: LoggerServiceInterface
  private readonly saveUserFavoriteWordUsecase: SaveUserFavoriteWordUsecaseInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
    this.saveUserFavoriteWordUsecase = params.saveUserFavoriteWordUsecase
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const usecaseInput: SaveUserFavoriteWordUsecaseInput = {
        userId: input?.body?.userData?.id,
        word: input?.params?.word,
      }

      await this.saveUserFavoriteWordUsecase.execute(usecaseInput)
      return success(201, null)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('Save user favorite word error', { error: formattedError })
      return formattedError
    }
  }
}
