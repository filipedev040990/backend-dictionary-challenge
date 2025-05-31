import { HttpRequest } from '@/domain/controller/controller.interface'
import CreateUserController from './create-user.controller'
import { CreateUserUsecaseInterface, CreateUserUsecaseOutput } from '@/domain/usecases/users/create-user-usecase.interface'
import { mock } from 'jest-mock-extended'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'

const params: any = {
  createUserUsecase: mock<CreateUserUsecaseInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
}

const usecaseOutput: CreateUserUsecaseOutput = {
  id: 'anyId',
  name: 'Zé das Couves',
  token: 'anyToken',
}

describe('CreateUserController', () => {
  let sut: CreateUserController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateUserController(params)
    input = {
      body: {
        name: 'Zé das Couves',
        username: 'zedascouves',
        password: '123456789',
      },
    }
    jest.spyOn(params.createUserUsecase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call CreateUserUsecase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.createUserUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.createUserUsecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 201, body: usecaseOutput })
  })
})
