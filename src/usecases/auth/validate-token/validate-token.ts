import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { ValidateTokenUsecaseInterface, ValidateTokenUsecaseOutput } from '@/domain/usecases/auth/validate-token-usecase.interface'
import { AppContainer } from '@/infra/container/modules'

type DecodedTokenData = {
  id: string
  name: string
  username: string
}

export default class ValidateTokenUsecase implements ValidateTokenUsecaseInterface {
  private readonly tokenRepository: TokenRepositoryInterface
  private readonly tokenService: TokenServiceInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(params: AppContainer) {
    this.tokenRepository = params.tokenRepository
    this.tokenService = params.tokenService
    this.userRepository = params.userRepository
  }

  async execute(token: string): Promise<ValidateTokenUsecaseOutput> {
    const unauthorized = () => ({ valid: false, data: null })

    const tokenExists = await this.tokenRepository.get(token)
    if (!tokenExists) {
      return unauthorized()
    }

    const decodedTokenData = await this.tokenService.verify<DecodedTokenData>(token)
    if (!decodedTokenData) {
      return unauthorized()
    }

    const userExists = await this.userRepository.getByUsername(decodedTokenData.username)
    if (!userExists) {
      return unauthorized()
    }

    return {
      valid: true,
      data: {
        id: decodedTokenData.id,
        name: decodedTokenData.name,
        username: decodedTokenData.username,
      },
    }
  }
}
