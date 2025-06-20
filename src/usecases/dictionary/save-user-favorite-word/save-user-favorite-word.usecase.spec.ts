import { MissingParamError } from '@/shared/errors'
import SaveUserFavoriteWordUsecase from './save-user-favorite-word.usecase.'
import { UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { SaveUserFavoriteWordUsecaseInput } from '@/domain/usecases/dictionary/save-user-favorite-word-usecase.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const params: any = {
  userFavoritesWordRepository: mock<UserFavoritesWordsRepositoryInterface>(),
  uuidService: mock<UUIDServiceInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
}

describe('SaveUserFavoriteWordUsecase', () => {
  let sut: SaveUserFavoriteWordUsecase
  let input: SaveUserFavoriteWordUsecaseInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new SaveUserFavoriteWordUsecase(params)
    input = {
      userId: 'anyUserId',
      word: 'any',
    }
    jest.spyOn(params.uuidService, 'generate').mockReturnValue('anyUUID')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throws if word is not provided', async () => {
    input.word = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('word'))
  })

  test('should throws if userId is not provided', async () => {
    input.userId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  test('should save favorite word', async () => {
    await sut.execute(input)
    expect(params.uuidService.generate).toHaveBeenCalledTimes(1)
    expect(params.userFavoritesWordRepository.save).toHaveBeenCalledTimes(1)
    expect(params.userFavoritesWordRepository.save).toHaveBeenCalledWith({
      id: 'anyUUID',
      userId: 'anyUserId',
      word: 'any',
      createdAt: new Date(),
    })
  })

  test('should throw and log if save favorite word error', async () => {
    const error = new Error('Database fails')
    jest.spyOn(params.userFavoritesWordRepository, 'save').mockImplementationOnce(() => {
      throw error
    })

    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(error)
    expect(params.loggerService.error).toHaveBeenCalledWith('Failed to save favorite word', { error })
  })
})
