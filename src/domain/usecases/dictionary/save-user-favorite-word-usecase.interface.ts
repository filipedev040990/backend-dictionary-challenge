export type SaveUserFavoriteWordUsecaseInput = {
  userId: string
  word: string
}
export interface SaveUserFavoriteWordUsecaseInterface {
  execute: (input: SaveUserFavoriteWordUsecaseInput) => Promise<void>
}
