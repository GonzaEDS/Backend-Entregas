export default (error, req, res, next) => {
  console.error(error.cause)

  switch (Math.floor(error.code / 100)) {
    case 1:
      res.userErrorResponse({ message: 'Input Error', code: error.code })
      break
    case 2:
      res.userErrorResponse({ message: 'Logic Error', code: error.code })
      break
    case 4:
      res.userErrorResponse({ message: 'Bad Request', code: error.code })
      break
    case 5:
    default:
      res.serverErrorResponse({ message: 'Server Error', code: error.code })
      break
  }
}
