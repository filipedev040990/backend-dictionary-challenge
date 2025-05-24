import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { DICTIONARY_FILENAME, DICTIONARY_URL } from '@/shared/constants'

export default class ImportDictionaryUsecase implements ImportDictionaryUsecaseInterface {
  private readonly httpService: HttpServiceInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly dictionaryImportsRepository: DictionaryImportsRepositoryInterface
  private readonly pubSubService: PubSubServiceInterface

  constructor(params: AppContainer) {
    this.httpService = params.httpService
    this.loggerService = params.loggerService
    this.dictionaryImportsRepository = params.dictionaryImportsRepository
    this.pubSubService = params.pubSubService
  }

  async execute(): Promise<void> {
    const alreadytImported = await this.dictionaryImportsRepository.get()

    if (alreadytImported) {
      this.loggerService.info('Dictionary already imported')
      return
    }

    this.loggerService.info('Starting dictionary download')

    const dictionary = await this.httpService.get(DICTIONARY_URL)

    if (!dictionary) {
      return
    }

    await this.dictionaryImportsRepository.generateFile(DICTIONARY_FILENAME, dictionary)
    await this.pubSubService.publish('dictionary_downloaded', DICTIONARY_FILENAME)

    this.loggerService.info('Finished dictionary download')
  }
}
