import { LogLevel, LoggerServiceInterface } from '@/domain/services/logger.service.interface'
import pino, { Logger as PinoLogger } from 'pino'
import { getNamespace } from 'cls-hooked'

type LogData = {
  level: LogLevel
  requestId?: string
  [key: string]: any
}

export default class LoggerService implements LoggerServiceInterface {
  private readonly logger: PinoLogger

  constructor() {
    const streams = [
      {
        stream: pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'message',
          },
        }),
      },
    ]

    this.logger = pino(
      {
        level: 'info',
        name: 'backend-dictionary',
        base: {},
      },
      pino.multistream(streams)
    )
  }

  private logWithTracking(level: LogLevel, message: string, obj?: object): void {
    const logLevel: LogLevel = level
    if (logLevel === LogLevel.DEBUG) {
      return
    }

    const requestId = getNamespace('requestContext')?.get('requestId')
    const additionalInfo = { requestId, ...obj }

    const logObject: LogData = { level, ...additionalInfo }

    switch (level) {
      case LogLevel.INFO:
        this.logger.info(logObject, message)
        break
      case LogLevel.ERROR:
        this.logger.error(logObject, message)
        break
      case LogLevel.WARN:
        this.logger.warn(logObject, message)
        break
      case LogLevel.DEBUG:
        this.logger.debug(logObject, message)
        break
      case LogLevel.TRACE:
        this.logger.trace(logObject, message)
        break
      default:
        this.logger.info(logObject, message)
        break
    }
  }

  info(message: string, obj?: object): void {
    this.logWithTracking(LogLevel.INFO, message, obj)
  }

  error(message: string, obj?: object): void {
    this.logWithTracking(LogLevel.ERROR, message, obj)
  }

  warn(message: string, obj?: object): void {
    this.logWithTracking(LogLevel.WARN, message, obj)
  }

  debug(message: string, obj?: object): void {
    this.logWithTracking(LogLevel.DEBUG, message, obj)
  }

  trace(message: string, obj?: object): void {
    this.logWithTracking(LogLevel.TRACE, message, obj)
  }
}
