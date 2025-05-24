import { Router } from 'express'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/modules'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'

const router = Router()

router.use(requestIdMiddleware)

router.get('/import-dictionary', expressRouteAdapter(container.resolve('importDictionaryController')))

export { router }
