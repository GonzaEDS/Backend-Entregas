import { Router } from 'express'
import userManager from '../../dao/user.manager.js'
import userModel from '../../dao/models/users.model.js'
import jwt from 'jsonwebtoken'
import session from 'express-session'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const data = await userManager.registerUser(username, email, password)

    // Set the user's ID in the session
    req.session.userId = data.user._id
    res.status(200).json(data)
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ response: 'error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { token, user } = await userManager.loginUser(email, password)
    const userId = user._id
    const userIdString = userId.toString()
    console.log(userIdString)
    // Set the user's ID in the session
    req.session.userId = userId

    res.status(200).json({ token, user })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ response: 'error' })
  }
})

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

router.get('/session', (req, res) => {
  try {
    console.log(req.session)
    res.status(200).json(req.session.userId)
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
// TEST SESSION

export default router
