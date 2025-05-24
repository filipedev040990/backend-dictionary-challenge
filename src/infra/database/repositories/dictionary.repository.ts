import { DictionaryRepositoryData, DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { prismaClient } from '../prisma-client'

export default class DictionaryRepository implements DictionaryRepositoryInterface {
  async createMany(data: DictionaryRepositoryData[]): Promise<void> {
    await prismaClient.dictionary.createMany({ data })
  }
}
