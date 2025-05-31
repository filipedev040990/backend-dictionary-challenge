import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { SignInUsecaseInterface, SignInUsecaseOutput } from '@/domain/usecases/auth/sign-in-usecase.interface'
import SignInController from './sign-in.controller'
import { mock } from 'jest-mock-extended'

const params: any = {
  signInUsecase: mock<SignInUsecaseInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
}

const usecaseOutput: SignInUsecaseOutput = {
  id: 'anyId',
  name: 'Zé das Couves',
  token: 'anyToken',
}

describe('SignInController', () => {
  let sut: SignInController
  let input: HttpRequest

  beforeEach(() => {
    sut = new SignInController(params)
    input = {
      body: {
        username: 'zedascouves',
        password: '123456789',
      },
    }
    jest.spyOn(params.signInUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call SignInUsecase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.signInUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.signInUsecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: usecaseOutput })
  })
})
