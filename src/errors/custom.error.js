export default class CustomError extends Error {
  constructor({ name = 'Error', cause, message, code = 1 }) {
    super(message)
    this.name = name
    this.cause = cause
    this.code = code
  }
  static createError({ name = 'error', cause, message, code = 1 }) {
    const error = new Error(message, { cause })
    error.name = name
    error.code = code
    throw error
  }
}
