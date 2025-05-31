import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import SaveDictionaryUsecase from './save-dictionary.usecase'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  loggerService: mock<LoggerServiceInterface>(),
  dictionaryRepository: mock<DictionaryRepositoryInterface>(),
  uuidService: mock<UUIDServiceInterface>(),
  dictionaryImportsrepository: mock<DictionaryImportsRepositoryInterface>(),
}

describe('SaveDictionaryUsecase', () => {
  let sut: SaveDictionaryUsecase
  let input: string[]

  beforeEach(() => {
    sut = new SaveDictionaryUsecase(params)
    input = [
      'echo',
      'branch',
      'puzzle',
      'orange',
      'galaxy',
      'needle',
      'planet',
      'window',
      'rocket',
      'forest',
      'bridge',
      'circle',
      'marble',
      'anchor',
      'silver',
      'flame',
      'guitar',
      'jungle',
      'shadow',
      'mirror',
      'bubble',
      'crystal',
      'feather',
      'canyon',
      'island',
      'dragon',
      'pirate',
      'helmet',
      'rocket',
      'castle',
    ]

    jest.spyOn(params.uuidService, 'generate').mockReturnValue('anyId')
  })

  describe('execute', () => {
    test('should call DictionaryRepository.createMany three and with correct values', async () => {
      await sut.execute(input)
      expect(params.dictionaryRepository.createMany).toHaveBeenCalled()
    })
  })

  describe('chunkArray', () => {
    test('should return a correct arrays number', () => {
      const arrays = sut.chunkArray(input, 10)
      expect(arrays).toEqual([
        ['echo', 'branch', 'puzzle', 'orange', 'galaxy', 'needle', 'planet', 'window', 'rocket', 'forest'],
        ['bridge', 'circle', 'marble', 'anchor', 'silver', 'flame', 'guitar', 'jungle', 'shadow', 'mirror'],
        ['bubble', 'crystal', 'feather', 'canyon', 'island', 'dragon', 'pirate', 'helmet', 'rocket', 'castle'],
      ])
    })
  })
})
