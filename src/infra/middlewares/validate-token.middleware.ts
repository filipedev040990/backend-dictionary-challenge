import { ValidateTokenUsecaseInterface } from '@/domain/usecases/auth/validate-token-usecase.interface'
import { container } from '../container/modules'
import { NextFunction, Request, Response } from 'express'
import { LoggerServiceInterface } from '@/domain/services/logger.service.interface'

export const validateTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const validateTokenUsecase: ValidateTokenUsecaseInterface = container.resolve('validateTokenUsecase')
  const loggerService: LoggerServiceInterface = container.resolve('loggerService')

  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      loggerService.error('Authorization header is malformed or missing')
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const token = authHeader.slice(7).trim()

    const decodedToken = await validateTokenUsecase.execute(token)

    if (!decodedToken.valid) {
      loggerService.error('Invalid token is provided')
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    req.body = {
      userData: {
        id: decodedToken.data.id,
        name: decodedToken.data.name,
        username: decodedToken.data.username,
      },
    }

    next()
  } catch (error) {
    loggerService.error('Validate token error', { error })
    res.status(500).json('Internal server error')
  }
}
