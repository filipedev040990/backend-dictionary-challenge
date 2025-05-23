import { DictionaryRepositoryData, DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { prismaClient } from '../prisma-client'

export default class DictionaryRepository implements DictionaryRepositoryInterface {
  async save(data: DictionaryRepositoryData): Promise<void> {
    await prismaClient.dictionary.create({ data })
  }
}
