import { UserFavoritesWordRepositoryData, UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { prismaClient } from '../prisma-client'

export default class UserFavoritesWordsRepository implements UserFavoritesWordsRepositoryInterface {
  async save(data: UserFavoritesWordRepositoryData): Promise<void> {
    await prismaClient.userFavoritesWords.create({ data })
  }
}
