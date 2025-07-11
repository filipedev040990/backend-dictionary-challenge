export type DeleteUserFavoriteWordUsecaseInput = {
  userId: string
  word: string
}
export interface DeleteUserFavoriteWordUsecaseInterface {
  execute: (input: DeleteUserFavoriteWordUsecaseInput) => Promise<void>
}
