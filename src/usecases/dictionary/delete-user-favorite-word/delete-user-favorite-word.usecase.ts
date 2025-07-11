import { UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { DeleteUserFavoriteWordUsecaseInput, DeleteUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/delete-user-favorite-word-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { MissingParamError } from '@/shared/errors'

export default class DeleteUserFavoriteWordUsecase implements DeleteUserFavoriteWordUsecaseInterface {
  private readonly repository: UserFavoritesWordsRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.repository = params.userFavoritesWordsRepository
    this.loggerService = params.loggerService
  }

  async execute(input: DeleteUserFavoriteWordUsecaseInput): Promise<void> {
    try {
      const { userId, word } = input

      if (!userId) {
        throw new MissingParamError('userId')
      }

      if (!word) {
        throw new MissingParamError('word')
      }

      const wordExists = await this.repository.getWordByUserId(userId, word)

      if (!wordExists) {
        return
      }

      await this.repository.delete(userId, word)
    } catch (error) {
      this.loggerService.error('Failed to delete favorite word', { error })
      throw error
    }
  }
}
