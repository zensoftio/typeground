import HttpException from './http-exception'

export default class HttpBadRequestException extends HttpException {
  constructor(details?: any) {
    super(400, details)
  }
}