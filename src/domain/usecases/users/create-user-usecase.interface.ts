import { BuildUserEntityInput } from '@/domain/entities/user/user.entity.types'

export type CreateUserUsecaseOutput = {
  id: string
  name: string
  token: string
}

export interface CreateUserUsecaseInterface {
  execute: (input: BuildUserEntityInput) => Promise<CreateUserUsecaseOutput>
}
