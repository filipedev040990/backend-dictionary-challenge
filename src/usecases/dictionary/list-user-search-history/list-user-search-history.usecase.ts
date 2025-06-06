import { UserSearchHistoryRepositoryData, UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import {
  ListUserSearchHistoryUsecaseInput,
  ListUserSearchHistoryUsecaseInterface,
  ListUserSearchHistoryUsecaseOutput,
  PaginatedResultsOutput,
} from '@/domain/usecases/dictionary/list-user-search-history-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { MissingParamError } from '@/shared/errors'

export default class ListUserSearchHistoryUsecase implements ListUserSearchHistoryUsecaseInterface {
  private readonly userSearchHistoryRepository: UserSearchHistoryRepositoryInterface

  constructor(params: AppContainer) {
    this.userSearchHistoryRepository = params.userSearchHistoryRepository
  }

  async execute(input: ListUserSearchHistoryUsecaseInput): Promise<ListUserSearchHistoryUsecaseOutput> {
    if (!input.userId) {
      throw new MissingParamError('userId')
    }

    const words = await this.userSearchHistoryRepository.getByUserId(input.userId)
    const page = Math.max(1, input.page ?? 1)
    const limit = Math.max(1, input.limit ?? 10)

    const paginated = this.paginateResults(page, limit, words)
    const totalDocs = words.length
    const totalPages = Math.ceil(totalDocs / limit)

    return {
      results: paginated,
      page,
      totalDocs,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }

  paginateResults(page: number, limit: number, words: UserSearchHistoryRepositoryData[]): PaginatedResultsOutput[] {
    if (!words?.length) {
      return []
    }

    const offset = (page - 1) * limit
    const paginated = words.slice(offset, offset + limit)

    const output: PaginatedResultsOutput[] = []

    paginated.map((r) => output.push({ word: r.word, added: r.addedAt }))

    return output
  }
}
