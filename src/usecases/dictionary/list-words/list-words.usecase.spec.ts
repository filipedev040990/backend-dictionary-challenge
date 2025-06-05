import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import ListWordsUsecase from './list-words.usecase'
import { ListWordsUsecaseInput } from '@/domain/usecases/dictionary/list-words-usecase.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const params: any = {
  cacheService: mock<CacheServiceInterface>(),
  dictionaryRepository: mock<DictionaryRepositoryInterface>(),
  userSearchHistoryRepository: mock<UserSearchHistoryRepositoryInterface>(),
  uuidService: mock<UUIDServiceInterface>(),
}

const wordsList = [
  { id: '1', word: 'fire', createdAt: new Date('2024-01-01') },
  { id: '2', word: 'firefly', createdAt: new Date('2024-01-02') },
  { id: '3', word: 'fireplace', createdAt: new Date('2024-01-03') },
  { id: '4', word: 'fireman', createdAt: new Date('2024-01-04') },
  { id: '5', word: 'fireproof', createdAt: new Date('2024-01-05') },
  { id: '6', word: 'fireball', createdAt: new Date('2024-01-06') },
  { id: '7', word: 'firestorm', createdAt: new Date('2024-01-07') },
  { id: '8', word: 'firewood', createdAt: new Date('2024-01-08') },
  { id: '9', word: 'firebrand', createdAt: new Date('2024-01-09') },
  { id: '10', word: 'firearm', createdAt: new Date('2024-01-10') },
  { id: '11', word: 'firetruck', createdAt: new Date('2024-01-11') },
  { id: '12', word: 'firestone', createdAt: new Date('2024-01-12') },
  { id: '13', word: 'fireguard', createdAt: new Date('2024-01-13') },
  { id: '14', word: 'firelight', createdAt: new Date('2024-01-14') },
  { id: '15', word: 'firebug', createdAt: new Date('2024-01-15') },
  { id: '16', word: 'firecode', createdAt: new Date('2024-01-16') },
  { id: '17', word: 'firehouse', createdAt: new Date('2024-01-17') },
  { id: '18', word: 'firebreak', createdAt: new Date('2024-01-18') },
  { id: '19', word: 'fireballer', createdAt: new Date('2024-01-19') },
  { id: '20', word: 'fireboat', createdAt: new Date('2024-01-20') },
  { id: '21', word: 'manfire', createdAt: new Date('2024-01-20') },
  { id: '22', word: 'water', createdAt: new Date('2024-01-20') },
  { id: '23', word: 'plain', createdAt: new Date('2024-01-20') },
  { id: '24', word: 'soap', createdAt: new Date('2024-01-20') },
  { id: '25', word: 'cat', createdAt: new Date('2024-01-20') },
]

describe('ListWordsUsecase', () => {
  let sut: ListWordsUsecase
  let input: ListWordsUsecaseInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new ListWordsUsecase(params)
    input = {
      userId: 'anyUserId',
      search: 'fire',
      limit: 4,
      page: 1,
    }
    jest.spyOn(params.dictionaryRepository, 'getWords').mockResolvedValue(wordsList)
    jest.spyOn(params.cacheService, 'get').mockResolvedValue(null)
    jest.spyOn(params.uuidService, 'generate').mockReturnValue('anyUUID')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call CacheService.get once and with correct values', async () => {
    await sut.execute(input)
    expect(params.cacheService.get).toHaveBeenCalledTimes(1)
    expect(params.cacheService.get).toHaveBeenCalledWith('words_list')
  })

  test('should return results from cache', async () => {
    jest.spyOn(params.cacheService, 'get').mockResolvedValueOnce(wordsList)
    await sut.execute(input)
    expect(params.dictionaryRepository.getWords).toHaveBeenCalledTimes(0)
  })

  test('should call CacheService.set once and with correct values', async () => {
    await sut.execute(input)
    expect(params.cacheService.set).toHaveBeenCalledTimes(1)
    expect(params.cacheService.set).toHaveBeenCalledWith('words_list', wordsList)
  })

  test('should call dictionaryRepository.getWords once and with correct value', async () => {
    await sut.execute(input)
    expect(params.dictionaryRepository.getWords).toHaveBeenCalledTimes(1)
  })

  test('should return empty if dictionaryRepository.getWords returns null', async () => {
    jest.spyOn(params.dictionaryRepository, 'getWords').mockResolvedValueOnce(null)
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
      results: ['fire', 'firefly', 'fireplace', 'fireman'],
      page: 1,
      totalDocs: 21,
      totalPages: 6,
      hasNext: true,
      hasPrev: false,
    })
  })

  test('should return a correct output when page = 2', async () => {
    input.page = 2
    const output = await sut.execute(input)
    expect(output).toEqual({
      results: ['fireproof', 'fireball', 'firestorm', 'firewood'],
      page: 2,
      totalDocs: 21,
      totalPages: 6,
      hasNext: true,
      hasPrev: true,
    })
  })

  test('should return a correct output when page = 5', async () => {
    input.page = 5
    const output = await sut.execute(input)
    expect(output).toEqual({
      results: ['firehouse', 'firebreak', 'fireballer', 'fireboat'],
      page: 5,
      totalDocs: 21,
      totalPages: 6,
      hasNext: true,
      hasPrev: true,
    })
  })

  test('should call userRepository.saveSearchHistory once and with correct value', async () => {
    await sut.execute(input)
    expect(params.userSearchHistoryRepository.save).toHaveBeenCalledTimes(1)
    expect(params.userSearchHistoryRepository.save).toHaveBeenCalledWith({
      id: 'anyUUID',
      userId: 'anyUserId',
      word: 'fire',
      addedAt: new Date(),
    })
  })

  test('should not call userSearchHistoryRepository.save once and with correct value', async () => {
    input.search = ''
    await sut.execute(input)
    expect(params.userSearchHistoryRepository.save).toHaveBeenCalledTimes(0)
  })
})
