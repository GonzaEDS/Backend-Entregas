import passport from 'passport'
import jwt from 'jsonwebtoken'

function requireAuth(authorizedRoles) {
  return function (req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log('error:', err)
        return res.render('unauthorized')
      }

      // Decode the JWT token and check its payload
      const token = req.cookies.AUTH
      if (token) {
        const decoded = jwt.decode(token)
        console.log('Decode the JWT token and check its payload', decoded)

        if (decoded && decoded._id && authorizedRoles.includes(decoded.role)) {
          req.user = user
          next()
        } else {
          return res.render('unauthorized')
        }
      } else {
        return res.render('unauthorized')
      }
    })(req, res, next)
  }
}

export default requireAuth
