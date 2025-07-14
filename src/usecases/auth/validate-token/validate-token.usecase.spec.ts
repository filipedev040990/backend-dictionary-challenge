import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import ValidateTokenUsecase from './validate-token.usecase'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  tokenRepository: mock<TokenRepositoryInterface>(),
  tokenService: mock<TokenServiceInterface>(),
  userRepository: mock<UserRepositoryInterface>(),
}

const fakeTokenRepositoryData = {
  id: 'anyTokenId',
  token: 'anyToken',
  createdAt: new Date('2025-01-01'),
}

const fakeDecodedTokenData = {
  id: 'anyId',
  name: 'Zé das Couves',
  username: 'zedascouves',
}

const fakeUserData = {
  id: 'anyId',
  name: 'Zé das Couves',
  username: 'zedascouves',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ValidateTokenUsecase', () => {
  let sut: ValidateTokenUsecase
  let token: string

  beforeEach(() => {
    sut = new ValidateTokenUsecase(params)
    token = 'anyToken'
    jest.spyOn(params.tokenRepository, 'get').mockResolvedValue(fakeTokenRepositoryData)
    jest.spyOn(params.tokenService, 'verify').mockResolvedValue(fakeDecodedTokenData)
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValue(fakeUserData)
  })

  test('should call TokenRepository.get once and with correct value', async () => {
    await sut.execute(token)
    expect(params.tokenRepository.get).toHaveBeenCalledTimes(1)
    expect(params.tokenRepository.get).toHaveBeenCalledWith('anyToken')
  })

  test('should return false if TokenRepository.get returns null', async () => {
    jest.spyOn(params.tokenRepository, 'get').mockResolvedValueOnce(null)
    const output = await sut.execute(token)
    expect(output).toEqual({ valid: false, data: null })
  })

  test('should call tokenService.verify once and with correct value', async () => {
    await sut.execute(token)
    expect(params.tokenService.verify).toHaveBeenCalledTimes(1)
    expect(params.tokenService.verify).toHaveBeenCalledWith('anyToken')
  })

  test('should return false if TokenService.verify returns null', async () => {
    jest.spyOn(params.tokenService, 'verify').mockResolvedValueOnce(null)
    const output = await sut.execute(token)
    expect(output).toEqual({ valid: false, data: null })
  })

  test('should call UserRepository.getByUsername once and with correct value', async () => {
    await sut.execute(token)
    expect(params.userRepository.getByUsername).toHaveBeenCalledTimes(1)
    expect(params.userRepository.getByUsername).toHaveBeenCalledWith('zedascouves')
  })

  test('should return false if UserRepository.getByUsername returns null', async () => {
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValueOnce(null)
    const output = await sut.execute(token)
    expect(output).toEqual({ valid: false, data: null })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(token)
    expect(output).toEqual({
      valid: true,
      data: {
        id: 'anyId',
        name: 'Zé das Couves',
        username: 'zedascouves',
      },
    })
  })

  test('should call tokenService.delete if token is invalid', async () => {
    jest.spyOn(params.tokenService, 'verify').mockResolvedValueOnce(null)
    await sut.execute(token)
    expect(params.tokenRepository.delete).toHaveBeenCalledTimes(1)
    expect(params.tokenRepository.delete).toHaveBeenCalledWith('anyTokenId')
  })

  test('should call tokenRepository.delete if token no found user', async () => {
    jest.spyOn(params.userRepository, 'getByUsername').mockResolvedValueOnce(null)
    await sut.execute(token)
    expect(params.tokenRepository.delete).toHaveBeenCalledTimes(1)
    expect(params.tokenRepository.delete).toHaveBeenCalledWith('anyTokenId')
  })
})
