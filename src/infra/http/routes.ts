import { Router } from 'express'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/modules'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'
import { validateSchema } from '../middlewares/schema-validator.middleware'

const router = Router()

router.use(requestIdMiddleware)

// Dictionary
router.get('/import-dictionary', expressRouteAdapter(container.resolve('importDictionaryController')))

// Users
router.post('/auth/signup', validateSchema('signUpSchema'), expressRouteAdapter(container.resolve('signUpController')))
router.post('/auth/signin', validateSchema('signInSchema'), expressRouteAdapter(container.resolve('signInController')))

export { router }
