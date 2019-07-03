/**
 * @class HttpException
 * @extends Error
 */
export class HttpException extends Error {
  constructor(public status: number = 500, message?: any) {
    super(message)
    Object.setPrototypeOf(this, HttpException.prototype)
  }
}

/**
 * @class HttpBadRequestException
 * @extends HttpException
 */
export class HttpBadRequestException extends HttpException {
  constructor(details?: any) {
    super(400, details)
    Object.setPrototypeOf(this, HttpBadRequestException.prototype)
  }
}

/**
 * @class HttpInternalError
 * @extends HttpException
 */
export class HttpInternalError extends HttpException {
  constructor(details?: any) {
    super(500, details)
    Object.setPrototypeOf(this, HttpInternalError.prototype)
  }
}

/**
 * @class HttpAuthNotFoundError
 * @extends HttpException
 */
export class HttpAuthNotFoundError extends HttpException {
  constructor(message: string = 'No access') {
    super(403, message)
    Object.setPrototypeOf(this, HttpAuthNotFoundError.prototype)
  }
}

/**
 * @class HttpAuthNotFoundError
 * @extends HttpException
 */
export class HttpDataNotFoundError extends HttpException {
  constructor(message: string = 'Not found') {
    super(404, message)
    Object.setPrototypeOf(this, HttpAuthNotFoundError.prototype)
  }
}

/**
 * @class HttpAuthFailedError
 * @extends HttpException
 */
export class HttpAuthFailedError extends HttpException {
  constructor(message: string = 'No access') {
    super(401, message)
    Object.setPrototypeOf(this, HttpAuthFailedError.prototype)
  }
}
