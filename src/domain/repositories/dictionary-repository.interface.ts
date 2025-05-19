export type DictionaryRepositoryData = {
  id: string
  word: string
  createdAt: Date
}

export interface DictionaryRepositoryInterface {
  save: (input: DictionaryRepositoryData) => Promise<void>
}
