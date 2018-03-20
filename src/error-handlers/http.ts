import {HttpAuthFailedError, HttpAuthNotFoundError, HttpException, HttpInternalError} from '../core/exceptions/http'
import {AuthFailedException, AuthNotFoundException} from '../core/exceptions/auth'

type Handler<T extends Error> = (error: T) => HttpException

interface HandlerFilter<T extends Error> {
  filter: (error: Error) => boolean
  handler: Handler<T>
}

const baseFilter: HandlerFilter<Error> = {
  filter: () => true,
  handler: e => new HttpInternalError(e.message || e)
}

const errorHandlers: HandlerFilter<any>[] = [
  {
    filter: e => e instanceof HttpException,
    handler: e => e as HttpException
  },
  {
    filter: e => e instanceof AuthNotFoundException,
    handler: e => new HttpAuthNotFoundError(e.message)
  },
  {
    filter: e => e instanceof AuthFailedException,
    handler: e => new HttpAuthFailedError(e.message)
  },
  baseFilter
]

export const httpErrorHandler = (error: Error): HttpException => {
  const {handler} = errorHandlers.find(it => it.filter(error)) || baseFilter
  return handler(error)
}
