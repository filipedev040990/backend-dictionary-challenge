import { DeleteUserFavoriteWordUsecaseInput } from '@/domain/usecases/dictionary/delete-user-favorite-word-usecase.interface'
import DeleteUserFavoriteWordUsecase from './delete-user-favorite-word.usecase'
import { UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { mock } from 'jest-mock-extended'
import { MissingParamError } from '@/shared/errors'

const params: any = {
  userFavoritesWordsRepository: mock<UserFavoritesWordsRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
}

describe('DeleteUserFavoriteWordUsecase', () => {
  let sut: DeleteUserFavoriteWordUsecase
  let input: DeleteUserFavoriteWordUsecaseInput

  beforeEach(() => {
    sut = new DeleteUserFavoriteWordUsecase(params)
    input = {
      userId: 'anyUserId',
      word: 'anyWord',
    }
    jest.spyOn(params.userFavoritesWordsRepository, 'getWordByUserId').mockResolvedValue({
      id: 'anyId',
      userId: input.userId,
      word: input.word,
      createdAt: new Date('2025-01-01'),
    })
  })

  test('should throw if a userId is not provided', async () => {
    input.userId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  test('should throw if a word is not provided', async () => {
    input.word = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('word'))
  })

  test('should call UserFavoritesWordsRepository.getWordByUserId once and with correct values', async () => {
    await sut.execute(input)
    expect(params.userFavoritesWordsRepository.getWordByUserId).toHaveBeenCalledTimes(1)
    expect(params.userFavoritesWordsRepository.getWordByUserId).toHaveBeenCalledWith(input.userId, input.word)
  })

  test('should delete favorite word', async () => {
    await sut.execute(input)
    expect(params.userFavoritesWordsRepository.delete).toHaveBeenCalledTimes(1)
    expect(params.userFavoritesWordsRepository.delete).toHaveBeenCalledWith('anyId')
  })

  test('should not call UserFavoritesWordsRepository.delete if no found word', async () => {
    jest.spyOn(params.userFavoritesWordsRepository, 'getWordByUserId').mockResolvedValueOnce(null)
    await sut.execute(input)
    expect(params.userFavoritesWordsRepository.delete).toHaveBeenCalledTimes(0)
  })
})
