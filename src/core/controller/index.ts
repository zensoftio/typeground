import {Response} from 'express'
import {HttpException} from '../exceptions/http'

export default interface Controller {
  errorHandler: (e: Error) => HttpException

  response(res: Response, options: any): void

  error(res: Response, error: HttpException): void

  bindRouter(): void
}
