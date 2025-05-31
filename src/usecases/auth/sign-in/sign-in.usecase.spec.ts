import { SignInUsecaseInput } from '@/domain/usecases/auth/sign-in-usecase.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import SignInUsecase from './sign-in.usecase'
import { MissingParamError, UnauthorizedError } from '@/shared/errors'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { mock } from 'jest-mock-extended'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import MockDate from 'mockdate'

const params: any = {
  userRepository: mock<UserRepositoryInterface>(),
  tokenService: mock<TokenServiceInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  tokenRepository: mock<TokenRepositoryInterface>(),
  hashService: mock<HashServiceInterface>(),
  uuidService: mock<UUIDServiceInterface>(),
}

const fakeUser = {
  id: 'anyId',
  name: 'Zé das Couves',
  username: 'zedascouves',
  password: '$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('SignInUsecase', () => {
  let sut: SignInUsecase
  let input: SignInUsecaseInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new SignInUsecase(params)
    input = {
      username: 'zedascouves',
      password: '123456789',
    }
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValue(fakeUser)
    jest.spyOn(params.hashService, 'compareHash').mockResolvedValue(true)
    jest.spyOn(params.tokenService, 'generate').mockResolvedValue('anyToken')
    jest.spyOn(params.uuidService, 'generate').mockReturnValue('anyUUID')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if username is not provided', async () => {
    input.username = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('username'))
  })

  test('should throw if password is not provided', async () => {
    input.password = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call UserRepository.getByUsername once and with correct values', async () => {
    await sut.execute(input)
    expect(params.userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(params.userRepository.getByUsername).toHaveBeenCalledWith(input.username)
  })

  test('should throws if UserRepository.getByUsername returns null', async () => {
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValue(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new UnauthorizedError())
  })

  test('should call HashService.compareHash once and with correct values', async () => {
    await sut.execute(input)
    expect(params.hashService.compareHash).toHaveBeenCalledTimes(1)
    expect(params.hashService.compareHash).toHaveBeenCalledWith(input.password, fakeUser.password)
  })

  test('should throws if HashService.compareHash returns null', async () => {
    jest.spyOn(params.hashService, 'compareHash').mockResolvedValue(false)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new UnauthorizedError())
  })

  test('should call TokenService.generate once and with correct values', async () => {
    await sut.execute(input)
    expect(params.tokenService.generate).toHaveBeenCalledTimes(1)
    expect(params.tokenService.generate).toHaveBeenCalledWith({ id: 'anyId', name: 'Zé das Couves', username: 'zedascouves' })
  })

  test('should call TokenRepository.save once and with correct valus', async () => {
    await sut.execute(input)

    expect(params.tokenRepository.save).toHaveBeenCalledTimes(1)
    expect(params.tokenRepository.save).toHaveBeenCalledWith({
      id: 'anyUUID',
      token: 'anyToken',
      createdAt: new Date(),
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({
      id: 'anyId',
      name: 'Zé das Couves',
      token: 'anyToken',
    })
  })
})
