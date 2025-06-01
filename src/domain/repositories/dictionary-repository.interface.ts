export type DictionaryRepositoryData = {
  id: string
  word: string
  createdAt: Date
}

export interface DictionaryRepositoryInterface {
  createMany: (input: DictionaryRepositoryData[]) => Promise<void>
  getWords: () => Promise<DictionaryRepositoryData[] | null>
}
