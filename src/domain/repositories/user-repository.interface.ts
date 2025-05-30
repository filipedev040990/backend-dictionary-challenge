export type UserRepositoryData = {
  id: string
  name: string
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface UserRepositoryInterface {
  save: (input: UserRepositoryData) => Promise<void>
  getByUsername: (username: string) => Promise<UserRepositoryData | null>
}
