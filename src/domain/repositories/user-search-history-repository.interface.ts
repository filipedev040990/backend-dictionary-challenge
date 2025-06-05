export type UserSearchHistoryRepositoryData = {
  id: string
  userId: string
  word: string
  addedAt: Date
}

export interface UserSearchHistoryRepositoryInterface {
  save: (input: UserSearchHistoryRepositoryData) => Promise<void>
}
