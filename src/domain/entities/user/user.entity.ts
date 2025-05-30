import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { BuildUserEntityInput } from './user.entity.types'
import { isBcryptHash, isValidString } from '@/shared/helpers/string.helper'
import { randomUUID } from 'crypto'

export default class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly password: string,
    public readonly username: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static build(input: BuildUserEntityInput): UserEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate(input: BuildUserEntityInput): void {
    const requiredFields: Array<keyof Omit<BuildUserEntityInput, 'id' | 'createdAt' | 'updatedAt'>> = ['name', 'username', 'password']

    for (const field of requiredFields) {
      if (!input[field] || !isValidString(input[field])) {
        throw new MissingParamError(field)
      }
    }

    if (!isBcryptHash(input.password)) {
      throw new InvalidParamError('password')
    }
  }

  private static create(input: BuildUserEntityInput): UserEntity {
    const { name, username, password } = input
    const id = input.id ?? randomUUID()
    const now = new Date()
    const createdAt = input.createdAt ?? now
    const updatedAt = input.createdAt ?? now

    return new UserEntity(id, name, password, username, createdAt, updatedAt)
  }
}
