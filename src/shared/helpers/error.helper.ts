import { HttpResponse } from '@/interfaces/controller/controller.interface'
import { ForbiddenError, InvalidJwtError, InvalidParamError, JwtMissingError, MissingParamError, UnauthorizedError } from '../errors'
import { badRequest, unauthorized, forbidden, serverError } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError) {
    return badRequest(error)
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized(error)
  }

  if (error instanceof ForbiddenError || error instanceof JwtMissingError || error instanceof InvalidJwtError) {
    return forbidden(error)
  }

  return serverError(error)
}
