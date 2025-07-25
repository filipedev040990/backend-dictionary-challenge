import { UserFavoritesWordRepositoryData, UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { prismaClient } from '../prisma-client'

export default class UserFavoritesWordsRepository implements UserFavoritesWordsRepositoryInterface {
  async save(data: UserFavoritesWordRepositoryData): Promise<void> {
    await prismaClient.userFavoritesWords.create({ data })
  }

  async getWordByUserId(userId: string, word: string): Promise<UserFavoritesWordRepositoryData | null> {
    const wordExists = await prismaClient.userFavoritesWords.findFirst({ where: { userId, word } })
    return wordExists ?? null
  }

  async delete(id: string): Promise<void> {
    await prismaClient.userFavoritesWords.delete({ where: { id } })
  }
}
