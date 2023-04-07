import { Router } from 'express'
import userManager from '../../dao/user.manager.js'
import userModel from '../../dao/models/users.model.js'
import jwt from 'jsonwebtoken'
import session from 'express-session'

import users from '../../dao/user.manager.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const data = await userManager.registerUser(username, email, password)
    if (data.message) {
      return res.status(203).json({ status: '203', message: data.message })
    }

    // Set the user's ID in the session
    const userId = data.user._id
    const cartId = await users.getCartByUserId(userId)
    req.session.userId = userId
    req.session.cartId = cartId
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

    // CONDITIONAL FOR ADMIN
    let cartId
    if (userId === 'admin') {
      // If user is admin, set cartId to null
      cartId = 'admin'
      req.session.user = user
      // req.session.username = 'Admin'
      // req.session.email =
    } else {
      // Get the cart ID associated with the user ID
      cartId = await users.getCartByUserId(userId)
    }
    req.session.userId = userId
    req.session.cartId = cartId

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

// TEST SESSION
router.get('/session', (req, res) => {
  try {
    console.log(req.session)
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
    console.log('users.router.js /:userId', data.cartId.products)
    res.status(200).json(data)
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ response: 'error' })
  }
})

export default router
