import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { DeleteUserFavoriteWordUsecaseInput, DeleteUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/delete-user-favorite-word-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class DeleteUserFavoriteWordController implements ControllerInterface {
  private readonly loggerService: LoggerServiceInterface
  private readonly deleteUserFavoriteWordUsecase: DeleteUserFavoriteWordUsecaseInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
    this.deleteUserFavoriteWordUsecase = params.deleteUserFavoriteWordUsecase
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const usecaseInput: DeleteUserFavoriteWordUsecaseInput = {
        userId: input?.body?.userData?.id,
        word: input?.params?.word,
      }

      await this.deleteUserFavoriteWordUsecase.execute(usecaseInput)
      return success(200, null)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('Delete user favorite word error', { error: formattedError })
      return formattedError
    }
  }
}
