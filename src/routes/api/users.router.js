import { Router } from 'express'
import userManager from '../../dao/user.manager.js'
import users from '../../dao/user.manager.js'
import passport from 'passport'

const router = Router()

router.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/api/users/failureregister'
  }),
  async (_req, res) => {
    try {
      res.status(200).json(data)
    } catch (error) {
      console.error(error.message)
      res.status(400).json({ response: 'error' })
    }
  }
)

router.get('/failureregister', (_req, res) => {
  res.send({ error: 'error during registration' })
})

router.get('/failurelogin', (_req, res) => {
  res.send({ error: 'error during login' })
})

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/api/users/failurelogin'
  }),
  async (req, res) => {
    req.session.user = req.user.email
    res.status(200).json({ status: 'ok' })
  }
)

router.post('/logout', (req, res) => {
  try {
    req.session.destroy()

    res.clearCookie('connect.sid')

    res.status(200).json({ response: 'success' })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ response: 'error' })
  }
})

// TEST SESSION
router.get('/session', (req, res) => {
  try {
    res.status(200).json(req.session)
    return
  } catch (error) {
    console.error('TEST SESSION', error.message)
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const data = await userManager.getUserById(userId)

    res.status(200).json(data)
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ response: 'error' })
  }
})

export default router
