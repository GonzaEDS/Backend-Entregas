import { Router } from 'express'
const router = Router()

router.get('/', async (req, res) => {
  try {
    if (req.cookies && req.cookies.AUTH) {
      res.redirect('/products')
    } else {
      res.render('login')
    }
  } catch (error) {
    req.logger.error(error)
  }
})
router.get('/register', async (req, res) => {
  try {
    res.render('register')
  } catch (error) {
    req.logger.error(error)
  }
})

export default router
