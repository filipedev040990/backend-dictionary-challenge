import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { SignInUsecaseInput, SignInUsecaseInterface, SignInUsecaseOutput } from '@/domain/usecases/auth/sign-in-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { MissingParamError, UnauthorizedError } from '@/shared/errors'
import { deepClone, isValidString, obfuscateValue } from '@/shared/helpers/string.helper'

export default class SignInUsecase implements SignInUsecaseInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly tokenService: TokenServiceInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly tokenRepository: TokenRepositoryInterface
  private readonly hashService: HashServiceInterface
  private readonly uuidService: UUIDServiceInterface

  constructor(params: AppContainer) {
    this.userRepository = params.userRepository
    this.tokenService = params.tokenService
    this.loggerService = params.loggerService
    this.tokenRepository = params.tokenRepository
    this.hashService = params.hashService
    this.uuidService = params.uuidService
  }

  async execute(input: SignInUsecaseInput): Promise<SignInUsecaseOutput> {
    this.loggerService.info('SignInUsecase<execute> called', { input: obfuscateValue(deepClone(input)) })

    try {
      this.validate(input)

      const credentialsExisting = await this.userRepository.getByUsername(input.username)
      if (!credentialsExisting) {
        this.loggerService.error('Authentication failed: Invalid username', { username: input.username })
        throw new UnauthorizedError()
      }

      const { id, name, username, password } = credentialsExisting

      const isValidPassword = await this.hashService.compareHash(input.password, password)
      if (!isValidPassword) {
        this.loggerService.error('Authentication failed: Invalid password attempt', { username: input.username })
        throw new UnauthorizedError()
      }

      const token = await this.tokenService.generate({ id, name, username })

      await this.tokenRepository.save({
        id: this.uuidService.generate(),
        token,
        createdAt: new Date(),
      })

      return {
        id,
        name,
        token,
      }
    } catch (error) {
      this.loggerService.error('SignInUsecase<execute> error', { error })
      throw error
    }
  }

  validate(input: SignInUsecaseInput): void {
    if (!input.username || !isValidString(input.username)) {
      throw new MissingParamError('username')
    }

    if (!input.password || !isValidString(input.password)) {
      throw new MissingParamError('password')
    }
  }
}
