import 'module-alias/register'
import { container } from '../container/modules'
import { router } from './routes'
import express from 'express'
import cors from 'cors'
import { subscribeRedisChannel } from '../tasks/subscribe-redis-channel'
import { REDIS_CHANNEL_DICTIONARY_DOWNLOADED } from '@/shared/constants'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../docs/swagger.json'

async function init() {
  const loggerService = container.resolve('loggerService')
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/api/v1', router)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  await subscribeRedisChannel(REDIS_CHANNEL_DICTIONARY_DOWNLOADED)

  const port = process.env.PORT ?? 3000

  app.listen(port, () => loggerService.info(`Server running at port ${port}`))
}

void init()
