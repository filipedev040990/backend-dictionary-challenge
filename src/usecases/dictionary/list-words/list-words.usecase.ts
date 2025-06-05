import { DictionaryRepositoryData, DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { ListWordsUsecaseInput, ListWordsUsecaseInterface, ListWordsUsecaseOutput } from '@/domain/usecases/dictionary/list-words-usecase.interface'
import { AppContainer } from '@/infra/container/modules'

export default class ListWordsUsecase implements ListWordsUsecaseInterface {
  private readonly cacheService: CacheServiceInterface
  private readonly dictionaryRepository: DictionaryRepositoryInterface
  private readonly userSearchHistoryRepository: UserSearchHistoryRepositoryInterface
  private readonly uuidService: UUIDServiceInterface

  constructor(params: AppContainer) {
    this.dictionaryRepository = params.dictionaryRepository
    this.cacheService = params.cacheService
    this.userSearchHistoryRepository = params.userSearchHistoryRepository
    this.uuidService = params.uuidService
  }

  async execute(input: ListWordsUsecaseInput): Promise<ListWordsUsecaseOutput> {
    const search = input.search ?? ''
    const page = Math.max(1, input.page ?? 1)
    const limit = Math.max(1, input.limit ?? 10)

    const words = await this.getWords(search)

    const paginated = this.paginateResults(page, limit, words)
    const totalDocs = words.length
    const totalPages = Math.ceil(totalDocs / limit)

    if (search !== '') {
      await this.saveUserSearchHistory(input.userId, search)
    }

    return {
      results: paginated,
      page,
      totalDocs,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }

  async getWords(term: string): Promise<DictionaryRepositoryData[]> {
    const filterByTerm = (words: DictionaryRepositoryData[]): DictionaryRepositoryData[] => {
      if (!term || term === '') {
        return words
      }

      return words.filter((word) => word.word.toLowerCase().includes(term.toLowerCase()))
    }

    const cachedWords = await this.cacheService.get<DictionaryRepositoryData[]>('words_list')

    if (cachedWords?.length) {
      return filterByTerm(cachedWords)
    }

    const repositoryWords = await this.dictionaryRepository.getWords()

    if (!repositoryWords?.length) {
      return []
    }

    await this.cacheService.set('words_list', repositoryWords)

    return filterByTerm(repositoryWords)
  }

  paginateResults(page: number, limit: number, words: DictionaryRepositoryData[]): string[] {
    const offset = (page - 1) * limit
    const paginated = words.slice(offset, offset + limit)
    return paginated.map((r) => r.word)
  }

  async saveUserSearchHistory(userId: string, word: string): Promise<void> {
    await this.userSearchHistoryRepository.save({
      id: this.uuidService.generate(),
      userId,
      word,
      addedAt: new Date(),
    })
  }
}
