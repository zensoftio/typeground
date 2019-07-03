import { ClientRequest } from 'http'

export class ResponseException extends Error {
  error: string | object

  constructor(error: string | object) {
    super(typeof error === 'string' ? error : 'ResponseException')
    this.error = error
  }

}

export class RequestException extends Error {
  request: ClientRequest

  constructor(request: ClientRequest) {
    super('The request was made but no response was received')
    this.request = request
  }

}

export class SettingUpRequestException extends Error {
  message: string

  constructor(message: string) {
    super(message)
  }

}
