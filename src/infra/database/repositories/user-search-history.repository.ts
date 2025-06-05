import { UserSearchHistoryRepositoryData, UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import { prismaClient } from '../prisma-client'

export default class UserSearchHistory implements UserSearchHistoryRepositoryInterface {
  async save(data: UserSearchHistoryRepositoryData): Promise<void> {
    await prismaClient.userSearchHistory.create({ data })
  }
}
