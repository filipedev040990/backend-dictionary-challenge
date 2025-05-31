export type SignInUsecaseInput = {
  username: string
  password: string
}

export type SignInUsecaseOutput = {
  id: string
  name: string
  token: string
}

export interface SignInUsecaseInterface {
  execute: (input: SignInUsecaseInput) => Promise<SignInUsecaseOutput>
}
