export class StartUpException extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, StartUpException.prototype)
  }
}
