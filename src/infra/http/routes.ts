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
router.post('/auth/signup', validateSchema('createUserSchema'), expressRouteAdapter(container.resolve('createUserController')))

export { router }
