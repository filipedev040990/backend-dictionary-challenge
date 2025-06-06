import { Router } from 'express'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/modules'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'
import { validateSchema } from '../middlewares/schema-validator.middleware'
import { validateTokenMiddleware } from '../middlewares/validate-token.middleware'

const router = Router()

router.use(requestIdMiddleware)

// Dictionary
router.get('/import-dictionary', validateTokenMiddleware, expressRouteAdapter(container.resolve('importDictionaryController')))
router.get('/entries/:lang', validateTokenMiddleware, expressRouteAdapter(container.resolve('listWordsController')))
router.get('/user/me/history', validateTokenMiddleware, expressRouteAdapter(container.resolve('listUserSearchHistoryController')))

// Users
router.post('/auth/signup', validateSchema('signUpSchema'), expressRouteAdapter(container.resolve('signUpController')))
router.post('/auth/signin', validateSchema('signInSchema'), expressRouteAdapter(container.resolve('signInController')))

export { router }
