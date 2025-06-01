import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { AppContainer } from '@/infra/container/modules'
import Redis from 'ioredis'

export default class CacheService implements CacheServiceInterface {
  private readonly redis: Redis
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    })

    this.loggerService = params.loggerService
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)

    if (!value) {
      return null
    }

    try {
      return JSON.parse(value) as T
    } catch (error) {
      this.loggerService.error(`Error parsing cache value for key ${key}`, { error })
      return null
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value)
    const args: [string, string, ...any[]] = [key, stringValue]

    if (ttl) {
      args.push('EX', ttl)
    }

    await this.redis.set(...args)
  }
}
