import { DictionaryRepositoryInterface } from '@/domain/repositories/dictionary-repository.interface'
import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { ImportDictionaryUsecaseInterface } from '@/domain/usecases/dictionary/import-dictionary-usecase.interface'
import { DictionaryImportsRepositoryInterface } from '@/domain/repositories/dictionary-imports-repository.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { UserRepositoryInterface } from '@/domain/repositories/user-repository.interface'
import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { SignUpUsecaseInterface } from '@/domain/usecases/auth/sign-up-usecase.interface'
import { TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { SignInUsecaseInterface } from '@/domain/usecases/auth/sign-in-usecase.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { ListWordsUsecaseInterface } from '@/domain/usecases/dictionary/list-words-usecase.interface'
import { UserSearchHistoryRepositoryInterface } from '@/domain/repositories/user-search-history-repository.interface'
import { ListUserSearchHistoryUsecaseInterface } from '@/domain/usecases/dictionary/list-user-search-history-usecase.interface'
import { UserFavoritesWordsRepositoryInterface } from '@/domain/repositories/user-favorites-words-repository.interface'
import { SaveUserFavoriteWordUsecaseInterface } from '@/domain/usecases/dictionary/save-user-favorite-word-usecase.interface'
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
  userRepository: UserRepositoryInterface
  hashService: HashServiceInterface
  tokenService: TokenServiceInterface
  signUpUsecase: SignUpUsecaseInterface
  tokenRepository: TokenRepositoryInterface
  signInUsecase: SignInUsecaseInterface
  cacheService: CacheServiceInterface
  listWordsUsecase: ListWordsUsecaseInterface
  userSearchHistoryRepository: UserSearchHistoryRepositoryInterface
  listUserSearchHistoryUsecase: ListUserSearchHistoryUsecaseInterface
  userFavoritesWordsRepository: UserFavoritesWordsRepositoryInterface
  saveUserFavoriteWordUsecase: SaveUserFavoriteWordUsecaseInterface
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
