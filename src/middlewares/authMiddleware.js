function requireAuth(req, res, next) {
  if (!req.session.userId) {
    res.render('unauthorized')
  } else {
    next()
  }
}

export default requireAuth
