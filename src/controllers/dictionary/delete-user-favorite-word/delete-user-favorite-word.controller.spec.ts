import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import DeleteUserFavoriteWordController from './delete-user-favorite-word.controller'
import { DeleteUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/delete-user-favorite-word-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  deleteUserFavoriteWordUsecase: mock<DeleteUserFavoriteWordUsecaseInterface>(),
}

describe('DeleteUserFavoriteWordController', () => {
  let sut: DeleteUserFavoriteWordController
  let input: HttpRequest

  beforeEach(() => {
    sut = new DeleteUserFavoriteWordController(params)
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

  test('should call deleteUserFavoriteWordUsecase.execute', async () => {
    await sut.execute(input)
    expect(params.deleteUserFavoriteWordUsecase.execute).toHaveBeenCalledTimes(1)
    expect(params.deleteUserFavoriteWordUsecase.execute).toHaveBeenCalledWith({
      userId: input.body.userData.id,
      word: input.body.word,
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: null })
  })
})
