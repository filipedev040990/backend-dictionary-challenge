import { BuildUserEntityInput } from '@/domain/entities/user/user.entity.types'
import CreateUserUsecase from './create-user.usecase'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import UserEntity from '@/domain/entities/user/user.entity'
import { InvalidParamError } from '@/shared/errors'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import MockDate from 'mockdate'
import { mock } from 'jest-mock-extended'

const params: any = {
  userRepository: mock<UserRepositoryInterface>(),
  hashService: mock<HashServiceInterface>(),
  tokenService: mock<TokenServiceInterface>(),
  tokenRepository: mock<TokenRepositoryInterface>(),
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

describe('CreateUserUsecase', () => {
  let sut: CreateUserUsecase
  let input: BuildUserEntityInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new CreateUserUsecase(params)
    input = {
      name: 'Zé das Couves',
      username: 'zedascouves',
      password: '123456789',
    }
    jest.spyOn(UserEntity, 'build').mockReturnValue(fakeUser)
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValue(null)
    jest.spyOn(params.hashService, 'generateHash').mockResolvedValue('$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS')
    jest.spyOn(params.tokenService, 'generate').mockReturnValue('anyToken')
    jest.spyOn(params.uuidService, 'generate').mockReturnValue('anyUUID')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should make a correct Entity', async () => {
    const spy = jest.spyOn(UserEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: 'Zé das Couves',
      username: 'zedascouves',
      password: '$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS',
    })
  })

  test('should call UserRepository.getByUsername once and with correct value', async () => {
    await sut.execute(input)

    expect(params.userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(params.userRepository.getByUsername).toHaveBeenCalledWith(input.username)
  })

  test('should throw if UserRepository.getByUsername return a user', async () => {
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValue({
      id: 'anotherId',
      name: 'Zé das Couves Silva',
      username: 'zedascouves',
      password: '$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow(new InvalidParamError('This username is already in use'))
  })

  test('should call UserRepository.save once and with correct value', async () => {
    await sut.execute(input)

    expect(params.userRepository.save).toHaveBeenCalledTimes(1)
    expect(params.userRepository.save).toHaveBeenCalledWith(fakeUser)
  })

  test('should call tokenService.generate once and with correct value', async () => {
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

    expect(output).toEqual({ id: 'anyId', name: 'Zé das Couves', token: 'anyToken' })
  })
})
