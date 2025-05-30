import UserEntity from '@/domain/entities/user/user.entity'
import { BuildUserEntityInput } from '@/domain/entities/user/user.entity.types'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { CreateUserUsecaseInterface, CreateUserUsecaseOutput } from '@/domain/usecases/users/create-user-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { InvalidParamError } from '@/shared/errors'

export default class CreateUserUsecase implements CreateUserUsecaseInterface {
  private readonly hashService: HashServiceInterface
  private readonly userRepository: UserRepositoryInterface
  private readonly tokenService: TokenServiceInterface

  constructor(params: AppContainer) {
    this.hashService = params.hashService
    this.userRepository = params.userRepository
    this.tokenService = params.tokenService
  }

  async execute(input: BuildUserEntityInput): Promise<CreateUserUsecaseOutput> {
    const { name, username, password } = input

    const user = UserEntity.build({
      name,
      username,
      password: await this.hashService.generateHash(password),
    })

    await this.ensureUniqueUsername(user.username)
    await this.userRepository.save(user)

    const token = await this.tokenService.generate({ id: user.id, name, username })

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
