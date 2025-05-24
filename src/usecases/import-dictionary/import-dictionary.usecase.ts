import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { DICTIONARY_FILENAME, DICTIONARY_URL, REDIS_CHANNEL_DICTIONARY_DOWNLOADED } from '@/shared/constants'
import UUIDService from '@/shared/services/uuid.service'

export default class ImportDictionaryUsecase implements ImportDictionaryUsecaseInterface {
  private readonly httpService: HttpServiceInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly dictionaryImportsRepository: DictionaryImportsRepositoryInterface
  private readonly pubSubService: PubSubServiceInterface
  private readonly uuidService: UUIDService

  constructor(params: AppContainer) {
    this.httpService = params.httpService
    this.loggerService = params.loggerService
    this.dictionaryImportsRepository = params.dictionaryImportsRepository
    this.pubSubService = params.pubSubService
    this.uuidService = params.uuidService
  }

  async execute(): Promise<{ status: string }> {
    const alreadytImported = await this.dictionaryImportsRepository.get()

    if (alreadytImported) {
      this.loggerService.info('Dictionary already imported')
      return {
        status: alreadytImported.status,
      }
    }

    this.loggerService.info('Starting dictionary download')

    const dictionary = await this.httpService.get(DICTIONARY_URL)

    if (!dictionary) {
      return {
        status: 'dictionary_not_found',
      }
    }

    await this.dictionaryImportsRepository.generateFile(DICTIONARY_FILENAME, dictionary)

    await this.dictionaryImportsRepository.save({
      id: this.uuidService.generate(),
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.pubSubService.publish(REDIS_CHANNEL_DICTIONARY_DOWNLOADED, JSON.stringify({ fileName: DICTIONARY_FILENAME }))

    this.loggerService.info('Publishing messagen on channel', { channel: REDIS_CHANNEL_DICTIONARY_DOWNLOADED })
    this.loggerService.info('Finished dictionary download')

    return {
      status: 'processing',
    }
  }
}
