import UserEntity from '@/domain/entities/user/user.entity'
import { BuildUserEntityInput } from '@/domain/entities/user/user.entity.types'
import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { SignUpUsecaseInterface, SignUpUsecaseOutput } from '@/domain/usecases/auth/sign-up-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { InvalidParamError } from '@/shared/errors'
import { obfuscateValue } from '@/shared/helpers/string.helper'

export default class SignUpUsecase implements SignUpUsecaseInterface {
  private readonly hashService: HashServiceInterface
  private readonly userRepository: UserRepositoryInterface
  private readonly tokenService: TokenServiceInterface
  private readonly tokenRepository: TokenRepositoryInterface
  private readonly uuidService: UUIDServiceInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.hashService = params.hashService
    this.userRepository = params.userRepository
    this.tokenService = params.tokenService
    this.tokenRepository = params.tokenRepository
    this.uuidService = params.uuidService
    this.loggerService = params.loggerService
  }

  async execute(input: BuildUserEntityInput): Promise<SignUpUsecaseOutput> {
    const { name, username, password } = input

    this.loggerService.info('SignUpUsecase<execute> called', { input: obfuscateValue(JSON.parse(JSON.stringify(input))) })

    const user = UserEntity.build({
      name,
      username,
      password: await this.hashService.generateHash(password),
    })

    await this.ensureUniqueUsername(user.username)
    await this.userRepository.save(user)

    const token = await this.tokenService.generate({ id: user.id, name, username })

    await this.tokenRepository.save({ id: this.uuidService.generate(), token, createdAt: new Date() })

    return {
      id: user.id,
      name,
      token,
    }
  }

  async ensureUniqueUsername(username: string): Promise<void> {
    const userNameExists = await this.userRepository.getByUsername(username)
    if (userNameExists) {
      throw new InvalidParamError('This username is already in use')
    }
  }
}
