import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary-usecase.interface'
import { AppContainer } from '@/infra/container/modules'
import { DICTIONARY_URL } from '@/shared/constants'

export default class ImportDictionaryUsecase implements ImportDictionaryUsecaseInterface {
  private readonly dictionaryRepository: DictionaryRepositoryInterface
  private readonly httpService: HttpServiceInterface
  private readonly uuidService: UUIDServiceInterface

  constructor(params: AppContainer) {
    this.dictionaryRepository = params.dictionaryRepository
    this.httpService = params.httpService
    this.uuidService = params.uuidService
  }

  async execute(): Promise<void> {
    const dictionary = await this.httpService.get(DICTIONARY_URL)

    if (!dictionary) {
      return
    }

    const words = Object.keys(dictionary)

    for (const word of words) {
      await this.dictionaryRepository.save({
        id: this.uuidService.generate(),
        word,
        createdAt: new Date(),
      })
    }
  }
}
