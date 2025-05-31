import { UserRepositoryData, UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { prismaClient } from '../prisma-client'

export default class UserRepository implements UserRepositoryInterface {
  async save(data: UserRepositoryData): Promise<void> {
    await prismaClient.user.create({ data })
  }

  async getByUsername(username: string): Promise<UserRepositoryData | null> {
    const user = await prismaClient.user.findUnique({ where: { username } })
    return user ?? null
  }
}
