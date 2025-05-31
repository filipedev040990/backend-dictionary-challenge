import { HttpRequest } from '@/domain/controller/controller.interface'
import SignUpController from './sign-up.controller'
import { SignUpUsecaseInterface, SignUpUsecaseOutput } from '@/domain/usecases/auth/sign-up-usecase.interface'
import { mock } from 'jest-mock-extended'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'

const params: any = {
  signUpUsecase: mock<SignUpUsecaseInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
}

const usecaseOutput: SignUpUsecaseOutput = {
  id: 'anyId',
  name: 'Zé das Couves',
  token: 'anyToken',
}

describe('SignUpController', () => {
  let sut: SignUpController
  let input: HttpRequest

  beforeEach(() => {
    sut = new SignUpController(params)
    input = {
      body: {
        name: 'Zé das Couves',
        username: 'zedascouves',
        password: '123456789',
      },
    }
    jest.spyOn(params.signUpUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call SignUpUsecase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.signUpUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.signUpUsecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 201, body: usecaseOutput })
  })
})
