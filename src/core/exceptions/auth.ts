export class AuthNotFoundException extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, AuthNotFoundException.prototype)
  }
}

export class AuthFailedException extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, AuthFailedException.prototype)
  }
}
