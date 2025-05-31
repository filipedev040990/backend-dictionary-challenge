export type ListWordsUsecaseInput = {
  search: string
  limit: number
}

export type ListWordsUsecaseOutput = {
  results: string[]
  totalDocs: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListWordsUsecaseInterface {
  execute: (input: ListWordsUsecaseInput) => Promise<ListWordsUsecaseOutput | null>
}
