import { UserSearchHistoryRepositoryData, UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import ListUserSearchHistoryUsecase from './list-user-search-history.usecase'
import { MissingParamError } from '@/shared/errors'
import { ListUserSearchHistoryUsecaseInput } from '@/domain/usecases/dictionary/list-user-search-history-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  userSearchHistoryRepository: mock<UserSearchHistoryRepositoryInterface>(),
}

const wordsList: UserSearchHistoryRepositoryData[] = [
  { id: '1', userId: 'anyUserId', word: 'fire', addedAt: new Date('2024-01-01') },
  { id: '2', userId: 'anyUserId', word: 'firefly', addedAt: new Date('2024-01-02') },
  { id: '3', userId: 'anyUserId', word: 'fireplace', addedAt: new Date('2024-01-03') },
  { id: '4', userId: 'anyUserId', word: 'fireman', addedAt: new Date('2024-01-04') },
  { id: '5', userId: 'anyUserId', word: 'fireproof', addedAt: new Date('2024-01-05') },
  { id: '6', userId: 'anyUserId', word: 'fireball', addedAt: new Date('2024-01-06') },
  { id: '7', userId: 'anyUserId', word: 'firestorm', addedAt: new Date('2024-01-07') },
  { id: '8', userId: 'anyUserId', word: 'firewood', addedAt: new Date('2024-01-08') },
  { id: '9', userId: 'anyUserId', word: 'firebrand', addedAt: new Date('2024-01-09') },
  { id: '10', userId: 'anyUserId', word: 'firearm', addedAt: new Date('2024-01-10') },
  { id: '11', userId: 'anyUserId', word: 'firetruck', addedAt: new Date('2024-01-11') },
  { id: '12', userId: 'anyUserId', word: 'firestone', addedAt: new Date('2024-01-12') },
  { id: '13', userId: 'anyUserId', word: 'fireguard', addedAt: new Date('2024-01-13') },
  { id: '14', userId: 'anyUserId', word: 'firelight', addedAt: new Date('2024-01-14') },
  { id: '15', userId: 'anyUserId', word: 'firebug', addedAt: new Date('2024-01-15') },
  { id: '16', userId: 'anyUserId', word: 'firecode', addedAt: new Date('2024-01-16') },
  { id: '17', userId: 'anyUserId', word: 'firehouse', addedAt: new Date('2024-01-17') },
  { id: '18', userId: 'anyUserId', word: 'firebreak', addedAt: new Date('2024-01-18') },
  { id: '19', userId: 'anyUserId', word: 'fireballer', addedAt: new Date('2024-01-19') },
  { id: '20', userId: 'anyUserId', word: 'fireboat', addedAt: new Date('2024-01-20') },
  { id: '21', userId: 'anyUserId', word: 'manfire', addedAt: new Date('2024-01-20') },
  { id: '22', userId: 'anyUserId', word: 'water', addedAt: new Date('2024-01-20') },
  { id: '23', userId: 'anyUserId', word: 'plain', addedAt: new Date('2024-01-20') },
  { id: '24', userId: 'anyUserId', word: 'soap', addedAt: new Date('2024-01-20') },
  { id: '25', userId: 'anyUserId', word: 'cat', addedAt: new Date('2024-01-20') },
]

describe('ListUserSearchHistoryUsecase', () => {
  let sut: ListUserSearchHistoryUsecase
  let input: ListUserSearchHistoryUsecaseInput

  beforeEach(() => {
    sut = new ListUserSearchHistoryUsecase(params)
    input = {
      userId: 'anyUserId',
      limit: 5,
      page: 1,
    }
    jest.spyOn(params.userSearchHistoryRepository, 'getByUserId').mockResolvedValue(wordsList)
  })

  test('should throw if userId is not provided', async () => {
    input.userId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  test('should call UserSearchHistoryRepository.getByUserId once and with correct userId', async () => {
    await sut.execute(input)
    expect(params.userSearchHistoryRepository.getByUserId).toHaveBeenCalledTimes(1)
    expect(params.userSearchHistoryRepository.getByUserId).toHaveBeenCalledWith('anyUserId')
  })

  test('should return empty if userSearchHistoryRepository.getByUserId returns null', async () => {
    jest.spyOn(params.userSearchHistoryRepository, 'getByUserId').mockResolvedValueOnce([])
    const output = await sut.execute(input)
    expect(output).toEqual({
      results: [],
      page: 1,
      totalDocs: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    })
  })

  test('should return a correct output when page = 1', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({
      results: [
        {
          word: 'fire',
          added: new Date('2024-01-01'),
        },
        {
          word: 'firefly',
          added: new Date('2024-01-02'),
        },
        {
          word: 'fireplace',
          added: new Date('2024-01-03'),
        },
        {
          word: 'fireman',
          added: new Date('2024-01-04'),
        },
        {
          word: 'fireproof',
          added: new Date('2024-01-05'),
        },
      ],
      page: 1,
      totalDocs: 25,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    })
  })

  test('should return a correct output when page = 2 and limit = 3', async () => {
    input.page = 2
    input.limit = 3
    const output = await sut.execute(input)

    expect(output).toEqual({
      results: [
        {
          word: 'fireman',
          added: new Date('2024-01-04'),
        },
        {
          word: 'fireproof',
          added: new Date('2024-01-05'),
        },
        {
          word: 'fireball',
          added: new Date('2024-01-06'),
        },
      ],
      page: 2,
      totalDocs: 25,
      totalPages: 9,
      hasNext: true,
      hasPrev: true,
    })
  })
})
