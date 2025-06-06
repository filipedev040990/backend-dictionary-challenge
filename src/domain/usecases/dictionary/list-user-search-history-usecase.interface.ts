export type ListUserSearchHistoryUsecaseInput = {
  userId: string
  limit?: number
  page?: number
}

export type PaginatedResultsOutput = {
  word: string
  added: Date
}

export type ListUserSearchHistoryUsecaseOutput = {
  results: PaginatedResultsOutput[]
  page: number
  totalDocs: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
export interface ListUserSearchHistoryUsecaseInterface {
  execute: (input: ListUserSearchHistoryUsecaseInput) => Promise<ListUserSearchHistoryUsecaseOutput>
}
