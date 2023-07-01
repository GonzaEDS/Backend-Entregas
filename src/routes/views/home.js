import { Router } from 'express'
import axios from '../../config/axios.instance.js'
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
router.get('/password-recovery', async (req, res) => {
  try {
    res.render('password-recovery')
  } catch (error) {
    req.logger.error(error)
  }
})

router.get('/reset/:token', async function (req, res) {
  try {
    const { token } = req.params
    const user = await axios.get(`/api/users/reset/${token}`)
    if (user) {
      res.render('reset-password', { token })
    }
  } catch (error) {
    req.logger.error(error)
  }
})

export default router
