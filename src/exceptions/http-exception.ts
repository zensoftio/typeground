export default class HttpException extends Error {
  name: string
  status: number
  statusCode: number
  error?: string

  constructor(status: number, message?: any) {
    super(message)

    this.name = 'HttpException'
    this.status = status || 500

    Error.captureStackTrace(this, this.constructor)
  }
}
