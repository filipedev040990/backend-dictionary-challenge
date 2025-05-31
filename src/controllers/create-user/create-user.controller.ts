import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { CreateUserUsecaseInterface } from '@/domain/usecases/users/create-user-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export default class CreateUserController implements ControllerInterface {
  private readonly createUserUsecase: CreateUserUsecaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.createUserUsecase = params.createUserUsecase
    this.loggerService = params.loggerService
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.createUserUsecase.execute(input?.body)
      return success(201, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CreateUserConrtoller error', { error })
      return formattedError
    }
  }
}
