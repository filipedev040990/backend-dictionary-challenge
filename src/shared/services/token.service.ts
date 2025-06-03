import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import { TokenServiceInterface } from '@/domain/services/token-service.interface'
import { AppContainer } from '@/infra/container/modules'
import jwt from 'jsonwebtoken'

export default class TokenService implements TokenServiceInterface {
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.loggerService = params.loggerService
  }

  async generate(value: object): Promise<string> {
    try {
      const token = jwt.sign(value, process.env.JWT_SECRET_KEY || '', { expiresIn: '1h' })
      return token
    } catch (error) {
      this.loggerService.error('Generate token error', { error })
      throw error
    }
  }

  async verify<T>(token: string): Promise<T | null> {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as T
      return decodedToken
    } catch (error) {
      this.loggerService.error('Verify token error', { error })
      return null
    }
  }
}
