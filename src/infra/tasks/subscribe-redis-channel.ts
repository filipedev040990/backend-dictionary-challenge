import { REDIS_CHANNEL_DICTIONARY_DOWNLOADED } from '@/shared/constants'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { container } from '../container/modules'

const loggerService = container.resolve('loggerService')
const saveDictionaryUsecase = container.resolve('saveDictionaryUsecase')
const pubSubService = container.resolve('pubSubService')

export const subscribeRedisChannel = async (channel: string) => {
  loggerService.info(`Subscribed on channel ${channel}`)

  await pubSubService.subscribe(channel, async (message: string) => {
    let data
    try {
      data = JSON.parse(message)

      if (channel === REDIS_CHANNEL_DICTIONARY_DOWNLOADED) {
        await saveDictionary(data)
      }
    } catch (error) {
      loggerService.error('Error parsing message', { message, error })
    }
  })
}

async function saveDictionary(data: any): Promise<void> {
  const filePath = join(__dirname, '../../../', data.fileName)

  if (!existsSync(filePath)) {
    loggerService.error('File not found', { filePath })
  }

  const fileContent = readFileSync(filePath, 'utf-8')
  const json = JSON.parse(fileContent)
  const words = Object.keys(json)

  await saveDictionaryUsecase.execute(words)
}
