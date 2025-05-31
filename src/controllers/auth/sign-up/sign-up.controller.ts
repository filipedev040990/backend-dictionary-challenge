import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { SignUpUsecaseInterface } from '@/domain/usecases/auth/sign-up-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class SignUpController implements ControllerInterface {
  private readonly signUpUsecase: SignUpUsecaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.signUpUsecase = params.signUpUsecase
    this.loggerService = params.loggerService
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.signUpUsecase.execute(input?.body)
      return success(201, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CreateUserConrtoller error', { error })
      return formattedError
    }
  }
}
