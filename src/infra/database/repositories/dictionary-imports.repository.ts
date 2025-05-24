import { DictionaryImportsRepositoryData, DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { prismaClient } from '../prisma-client'
import { join } from 'path'
import { writeFile } from 'fs/promises'

export default class DictionaryImportsRepository implements DictionaryImportsRepositoryInterface {
  async get(): Promise<DictionaryImportsRepositoryData | null> {
    const imports = await prismaClient.dictionaryImports.findMany()
    return imports ? imports[0] : null
  }

  async save(data: DictionaryImportsRepositoryData): Promise<void> {
    await prismaClient.dictionaryImports.create({ data })
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await prismaClient.dictionaryImports.update({ where: { id }, data: { status } })
  }

  async generateFile(fileName: string, content: Object): Promise<void> {
    const filePath = join(__dirname, '..', fileName)
    await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
  }
}
