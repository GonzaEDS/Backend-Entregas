function requireAuth(req, res, next) {
  if (!req.session.passport || !req.session.passport.user) {
    res.render('unauthorized')
  } else {
    next()
  }
}

export default requireAuth
