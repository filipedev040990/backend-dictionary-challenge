import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import SaveUserFavoriteWordController from './save-user-favorite-word.controller'
import { SaveUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/save-user-favorite-word-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  saveUserFavoriteWordUsecase: mock<SaveUserFavoriteWordUsecaseInterface>(),
}

describe('SaveUserFavoriteWordController', () => {
  let sut: SaveUserFavoriteWordController
  let input: HttpRequest

  beforeEach(() => {
    sut = new SaveUserFavoriteWordController(params)
    input = {
      body: {
        userData: {
          id: 'anyUserId',
          name: 'anyName',
          username: 'anyUsername',
        },
        query: {
          word: 'anyWord',
        },
      },
    }
  })

  test('should call saveUserFavoriteWordUsecase.execute', async () => {
    await sut.execute(input)
    expect(params.saveUserFavoriteWordUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.saveUserFavoriteWordUsecase.execute).toHaveBeenCalledWith({
      userId: input.body.userData.id,
      word: input.body.word,
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })
})
