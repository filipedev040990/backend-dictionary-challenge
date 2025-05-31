import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { SaveDictionaryUsecaseInterface } from '@/domain/usecases/dictionary/save-dictionary-usecase.interface'
import { AppContainer } from '@/infra/container/modules'

export default class SaveDictionaryUsecase implements SaveDictionaryUsecaseInterface {
  private readonly dictionaryRepository: DictionaryRepositoryInterface
  private readonly dictionaryImportsRepository: DictionaryImportsRepositoryInterface
  private readonly uuidService: UUIDServiceInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.dictionaryRepository = params.dictionaryRepository
    this.uuidService = params.uuidService
    this.loggerService = params.loggerService
    this.dictionaryImportsRepository = params.dictionaryImportsRepository
  }

  async execute(words: string[]): Promise<void> {
    const totalWords = words.length
    const chunkSize = 1000
    const totalChunks = Math.ceil(totalWords / chunkSize)

    this.loggerService.info('Starting dictionary save flow', { totalWords, chunkSize, totalChunks })

    try {
      const chunks = this.chunkArray(words, 1000)

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]

        const repositoryInput = chunk.map((word) => ({
          id: this.uuidService.generate(),
          word,
          createdAt: new Date(),
        }))

        await this.dictionaryRepository.createMany(repositoryInput)
        this.loggerService.info(`Processed chunk ${i + 1}/${chunks.length}`, { chunkSize: chunk.length })
      }

      await this.updateDictionaryImportsStatus()

      this.loggerService.info('Dictionary save flow completed', { totalWords, chunkSize, totalChunks })
    } catch (error) {
      this.loggerService.error('Failed to save dictionary data', { error })
    }
  }

  chunkArray(array: string[], chunkSize: number): string[][] {
    const chunks: string[][] = []

    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize)
      chunks.push(chunk)
    }

    return chunks
  }

  async updateDictionaryImportsStatus(): Promise<void> {
    const dictionaryImports = await this.dictionaryImportsRepository.get()
    if (dictionaryImports) {
      await this.dictionaryImportsRepository.updateStatus(dictionaryImports.id, 'finished')
    }
  }
}
