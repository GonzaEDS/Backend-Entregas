import { Router } from 'express'
const router = Router()

router.get('/', async (req, res) => {
  try {
    // check if the user is logged
    // console.log(req.cookies)
    // if (
    //   req.session &&
    //   req.session.passport &&
    //   req.session.passport.user &&
    //   req.session.passport.user.userId
    // )
    if (req.cookies && req.cookies.AUTH) {
      res.redirect('/products')
    } else {
      res.render('login')
    }
  } catch (error) {
    console.error(error)
  }
})
router.get('/register', async (req, res) => {
  try {
    res.render('register')
  } catch (error) {
    console.error(error)
  }
})

export default router
