import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { BuildUserEntityInput } from './user.entity.types'
import UserEntity from './user.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'anyId'),
}))

describe('UserEntity', () => {
  let sut: any
  let input: BuildUserEntityInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = UserEntity
    input = {
      name: 'Zé das Couves',
      username: 'zedascouves',
      password: '$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS',
    }
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field is not provided', () => {
    const requiredFields: Array<keyof Omit<BuildUserEntityInput, 'id' | 'createdAt' | 'updatedAt'>> = ['name', 'username', 'password']
    for (const field of requiredFields) {
      const backupField = input[field]

      input[field] = undefined as any

      expect(() => {
        sut.build(input)
      }).toThrow(new MissingParamError(field))

      input[field] = backupField
    }
  })

  test('should throw if a text plain password is provided', () => {
    input.password = 'text plain'

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('password'))
  })

  test('should return a correct Entity', () => {
    const userEntity = sut.build(input)
    expect(userEntity).toEqual({
      id: 'anyId',
      name: 'Zé das Couves',
      username: 'zedascouves',
      password: '$2a$12$T7fSzhfbNONT/7iGdVJee.7gKr0IQnE9qbDEmAprai6GNJEGdeMPS',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })
})
