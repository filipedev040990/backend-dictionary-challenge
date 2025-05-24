export type DictionaryImportsRepositoryData = {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface DictionaryImportsRepositoryInterface {
  get: () => Promise<DictionaryImportsRepositoryData | null>
  save: (input: DictionaryImportsRepositoryData) => Promise<void>
  updateStatus: (id: string, status: string) => Promise<void>
  generateFile: (fileName: string, content: Object) => Promise<void>
}
