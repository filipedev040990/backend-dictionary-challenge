import ImportDictionaryUsecase from './import-dictionary.usecase'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  httpService: mock<HttpServiceInterface>(),
  uuidService: mock<UUIDServiceInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  dictionaryImportsRepository: mock<DictionaryImportsRepositoryInterface>(),
  pubSubService: mock<PubSubServiceInterface>(),
}

const fakeHttpResponse = {
  a: 1,
  aa: 1,
  aaa: 1,
  aah: 1,
  aahed: 1,
  aahing: 1,
  aahs: 1,
  aal: 1,
  aalii: 1,
  aaliis: 1,
  aals: 1,
  aam: 1,
  aani: 1,
  aardvark: 1,
  aardvarks: 1,
  aardwolf: 1,
  aardwolves: 1,
  aargh: 1,
  aaron: 1,
  aaronic: 1,
  aaronical: 1,
  aaronite: 1,
  aaronitic: 1,
  aarrgh: 1,
  aarrghh: 1,
  aaru: 1,
  aas: 1,
  aasvogel: 1,
  aasvogels: 1,
  ab: 1,
  aba: 1,
  ababdeh: 1,
  ababua: 1,
  abac: 1,
  abaca: 1,
  abacay: 1,
}

describe('ImportDictionaryUsecase', () => {
  let sut: ImportDictionaryUsecase

  beforeEach(() => {
    sut = new ImportDictionaryUsecase(params)
    jest.spyOn(params.httpService, 'get').mockResolvedValue(fakeHttpResponse)
  })

  test('should call HttpService.get once and with correct params', async () => {
    await sut.execute()
    expect(params.httpService.get).toHaveBeenCalledTimes(1)
    expect(params.httpService.get).toHaveBeenCalledWith('https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json')
  })

  test('should call DictionaryImportsRepository.get', async () => {
    await sut.execute()
    expect(params.dictionaryImportsRepository.get).toHaveBeenCalledTimes(1)
  })

  test('should call DictionaryImportsRepository.generateFile', async () => {
    await sut.execute()
    expect(params.dictionaryImportsRepository.generateFile).toHaveBeenCalledTimes(1)
    expect(params.dictionaryImportsRepository.generateFile).toHaveBeenCalledWith('backend-dicionary.json', fakeHttpResponse)
  })

  test('should call PubSubService.publish once and with correct values', async () => {
    await sut.execute()
    expect(params.pubSubService.publish).toHaveBeenCalledTimes(1)
    expect(params.pubSubService.publish).toHaveBeenCalledWith('dictionary_downloaded', 'backend-dicionary.json')
  })
})
