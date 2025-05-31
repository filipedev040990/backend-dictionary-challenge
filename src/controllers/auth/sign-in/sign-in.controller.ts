import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { SignInUsecaseInterface } from '@/domain/usecases/auth/sign-in-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class SignInController implements ControllerInterface {
  private readonly signInUsecase: SignInUsecaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.signInUsecase = params.signInUsecase
    this.loggerService = params.loggerService
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.signInUsecase.execute(input?.body)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('SignInController error', { error })
      return formattedError
    }
  }
}
