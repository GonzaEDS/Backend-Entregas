import { Router } from 'express'
import axios from '../../config/axios.instance.js'
const router = Router()

import requireAuth from '../../middlewares/authMiddleware.js'

router.get('/', requireAuth, async (req, res) => {
  try {
    const id = req.session.passport.user.userId
    console.log(id)
    if (id == 'admin') {
      console.log(req.session.passport.user.userId)
      const user = req.session.passport.user.userId
      res.render('user', { user })
    } else {
      const response = await axios.get(`/api/users/${id}`)
      const user = response.data
      res.render('user', { user })
    }
  } catch (error) {
    console.error('user view', error.message)
    res.status(500).send('Server error')
  }
})

export default router
