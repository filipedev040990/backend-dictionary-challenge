import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/import-dictionary/import-dictionary-usecase.interface'
import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { createContainer, asClass } from 'awilix'
import path from 'path'
import lodash from 'lodash'

export type AppContainer = {
  dictionaryRepository: DictionaryRepositoryInterface
  httpService: HttpServiceInterface
  uuidService: UUIDServiceInterface
  loggerService: LoggerServiceInterface
  importDictionaryUsecase: ImportDictionaryUsecaseInterface
  dictionaryImportsRepository: DictionaryImportsRepositoryInterface
  pubSubService: PubSubServiceInterface
}

const container = createContainer()

const distDir = path.join(__dirname, '../../')

container.loadModules(
  [path.join(distDir, 'controllers/**/*.js'), path.join(distDir, 'usecases/**/**/*.js'), path.join(distDir, 'infra/database/repositories/*.js'), path.join(distDir, 'shared/services/**/*.js')],
  {
    formatName: (name: string) => {
      name = lodash.camelCase(name)

      return name
    },
    resolverOptions: {
      lifetime: 'SINGLETON',
      register: asClass,
    },
  }
)

export { container }
