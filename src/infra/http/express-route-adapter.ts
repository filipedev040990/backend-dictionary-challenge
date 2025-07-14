import { ControllerInterface, HttpRequest } from '@/domain/controller/controller.interface'
import { deepClone, obfuscateValue } from '@/shared/helpers/string.helper'
import { prismaClient } from '../database/prisma-client'
import { randomUUID } from 'crypto'
import { Request, Response } from 'express'
import { container } from '../container/modules'
import { getRequestId } from '@/shared/helpers/get-request-id.helper'

export const expressRouteAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      body: req?.body,
      params: req?.params,
      query: req?.query,
      headers: req?.headers,
    }

    const loggerService = container.resolve('loggerService')

    const bodyLog = input.body ? obfuscateValue(deepClone(input.body)) : null

    loggerService.info('Started request', {
      method: req.method,
      route: req.url,
      input: bodyLog ? JSON.stringify(bodyLog) : '',
    })

    const { statusCode, body } = await controller.execute(input)

    const output = statusCode >= 200 && statusCode <= 499 ? body : { error: body.message }

    await logRequest(req, input, statusCode, output)

    loggerService.info('Finished request', {
      output: JSON.stringify(output),
    })

    res.status(statusCode).json(output)
  }
}

const logRequest = async (req: Request, input: any, statusCode: number, output: any): Promise<void> => {
  await prismaClient.request.create({
    data: {
      id: randomUUID(),
      method: req.method,
      requestId: getRequestId(),
      userId: req?.body?.userData?.id ?? undefined,
      input: input.body ? JSON.stringify(input.body) : '',
      route: req.url,
      createdAt: new Date(),
      status: statusCode,
      output: JSON.stringify(output),
      updatedAt: new Date(),
    },
  })
}
