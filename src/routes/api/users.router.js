import { Router } from 'express'
import userManager from '../../dao/user.manager.js'
import users from '../../dao/user.manager.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

// router.post(
//   '/register',
//   passport.authenticate('register', { session: false }),
//   async (_req, res) => {
//     try {
//       res.status(200).json(data)
//     } catch (error) {
//       console.error('users.router.js:', error.message)
//       res.status(400).json({ response: 'error' })
//     }
//   }
// )

router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  async (req, res) => {
    try {
      const user = req.user
      res.status(200).json({
        status: 'success',
        message: 'User registered',
        user: { _id: user._id, username: user.username, email: user.email }
      })
    } catch (error) {
      console.error(error.message)
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
  passport.authenticate('login', { session: false }),
  async (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({ token, status: 'ok' })
  }
)

router.get('/logout', (req, res) => {
  // Clear the AUTH cookie
  res.clearCookie('AUTH')
  res.status(200).json({ message: 'Logged out successfully' })
})

//gihub

router.get(
  '/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] })
)

router.get(
  '/github-callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({ token })
  }
)

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
