import HttpException from './http-exception'

export default class HttpInternalErrorException extends HttpException {
  constructor(details?: any) {
    super(500, details)
  }
}