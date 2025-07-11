import { UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { SaveUserFavoriteWordUsecaseInput, SaveUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/save-user-favorite-word-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { MissingParamError } from '@/shared/errors'

export default class SaveUserFavoriteWordUsecase implements SaveUserFavoriteWordUsecaseInterface {
  private readonly repository: UserFavoritesWordsRepositoryInterface
  private readonly uuidService: UUIDServiceInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.repository = params.userFavoritesWordsRepository
    this.uuidService = params.uuidService
    this.loggerService = params.loggerService
  }

  async execute(input: SaveUserFavoriteWordUsecaseInput): Promise<void> {
    try {
      if (!input?.word) {
        throw new MissingParamError('word')
      }

      if (!input?.userId) {
        throw new MissingParamError('userId')
      }

      const wordExists = await this.repository.getWordByUserId(input.userId, input.word)

      if (wordExists) {
        return
      }

      await this.repository.save({
        id: this.uuidService.generate(),
        userId: input.userId,
        word: input.word,
        createdAt: new Date(),
      })
    } catch (error) {
      this.loggerService.error('Failed to save favorite word', { error })
      throw error
    }
  }
}
