import passport from 'passport'
import jwt from 'jsonwebtoken'

function requireAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.render('unauthorized')
    }

    // Decode the JWT token and check its payload
    const token = req.cookies.AUTH
    if (token) {
      const decoded = jwt.decode(token)
      console.log(decoded)

      if (decoded && decoded._id) {
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

export default requireAuth
