import jwt from 'jsonwebtoken'

export default function roleMiddleware(req, res, next) {
  const token = req.cookies.AUTH
  if (token) {
    const decoded = jwt.decode(token)
    if (decoded && decoded.role) {
      res.locals.role = decoded.role
    }
  }
  next()
}
