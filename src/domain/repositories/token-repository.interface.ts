export type TokenRepositoryData = {
  id: string
  token: string
  createdAt: Date
}

export interface TokenRepositoryInterface {
  save: (input: TokenRepositoryData) => Promise<void>
  get: (token: string) => Promise<TokenRepositoryData | null>
  delete: (id: string) => Promise<void>
}
