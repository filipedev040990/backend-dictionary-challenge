import { HttpServiceInterface } from '@/domain/services/http-servivce.interface'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { AppContainer } from '@/infra/container/modules'

export default class HttpService implements HttpServiceInterface {
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
  }

  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        this.loggerService.error('Http request error', { httpResponse: response })
      }

      const data = await response.json()

      return data
    } catch (error) {
      this.loggerService.error('Http request error', { error })
      throw error
    }
  }
}
