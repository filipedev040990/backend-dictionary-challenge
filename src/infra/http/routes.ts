import { Router } from 'express'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/modules'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'
import { validateSchema } from '../middlewares/schema-validator.middleware'
import { validateTokenMiddleware } from '../middlewares/validate-token.middleware'

const router = Router()

router.use(requestIdMiddleware)
// Users
router.post('/auth/signup', validateSchema('signUpSchema'), expressRouteAdapter(container.resolve('signUpController')))
router.post('/auth/signin', validateSchema('signInSchema'), expressRouteAdapter(container.resolve('signInController')))

// Dictionary
router.get('/import-dictionary', validateTokenMiddleware, expressRouteAdapter(container.resolve('importDictionaryController')))
router.get('/entries/:lang', validateTokenMiddleware, expressRouteAdapter(container.resolve('listWordsController')))
router.get('/user/me/history', validateTokenMiddleware, expressRouteAdapter(container.resolve('listUserSearchHistoryController')))
router.post('/entries/:lang/:word/favorite', validateTokenMiddleware, expressRouteAdapter(container.resolve('saveUserFavoriteWordController')))
router.post('/entries/:lang/:word/unfavorite', validateTokenMiddleware, expressRouteAdapter(container.resolve('deleteUserFavoriteWordController')))

export { router }
