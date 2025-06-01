export type ListWordsUsecaseInput = {
  search: string
  limit: number
  page: number
}

export type ListWordsUsecaseOutput = {
  results: string[]
  page: number
  totalDocs: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListWordsUsecaseInterface {
  execute: (input: ListWordsUsecaseInput) => Promise<ListWordsUsecaseOutput>
}
