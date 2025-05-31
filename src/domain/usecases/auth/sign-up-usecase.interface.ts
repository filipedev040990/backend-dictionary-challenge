import { BuildUserEntityInput } from '@/domain/entities/user/user.entity.types'

export type SignUpUsecaseOutput = {
  id: string
  name: string
  token: string
}

export interface SignUpUsecaseInterface {
  execute: (input: BuildUserEntityInput) => Promise<SignUpUsecaseOutput>
}
