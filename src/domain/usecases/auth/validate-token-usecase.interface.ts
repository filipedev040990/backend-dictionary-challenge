export type ValidateTokenUsecaseOutput = {
  valid: boolean
  data: any
}

export interface ValidateTokenUsecaseInterface {
  execute: (token: string) => Promise<ValidateTokenUsecaseOutput>
}
