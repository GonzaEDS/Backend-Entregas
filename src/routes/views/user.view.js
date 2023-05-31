import { Router } from 'express'
import axios from '../../config/axios.instance.js'
import jwt from 'jsonwebtoken'
const router = Router()

import requireAuth from '../../middlewares/authMiddleware.js'

router.get('/', requireAuth(['user', 'admin']), async (req, res) => {
  try {
    const id = req.user._id

    if (id == 'admin') {
      const user = { ...req.user, username: 'admin' }
      console.log(user)
      res.render('user', { user })
    } else {
      // Generate a new JWT token
      const jwtToken = jwt.sign(
        { _id: req.user._id, cartId: req.user.cartId },
        process.env.JWT_SECRET
      )

      const response = await axios.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })

      const user = response.data
      res.render('user', { user })
    }
  } catch (error) {
    console.error('user view', error.message)
    res.status(500).send('Server error')
  }
})

export default router
