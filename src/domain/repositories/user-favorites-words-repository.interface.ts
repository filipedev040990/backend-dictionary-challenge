export type UserFavoritesWordRepositoryData = {
  id: string
  userId: string
  word: string
  createdAt: Date
}

export interface UserFavoritesWordsRepositoryInterface {
  save: (input: UserFavoritesWordRepositoryData) => Promise<void>
}
