import { Router } from 'express'
import axios from 'axios'
const router = Router()

import requireAuth from '../../middlewares/authMiddleware.js'

axios.defaults.baseURL = 'http://localhost:3000/'
router.get('/', requireAuth, async (req, res) => {
  try {
    const id = req.session.userId
    console.log(id)
    const response = await axios.get(`/api/users/${id}`)
    const user = response.data
    res.render('user', { user })
  } catch (error) {
    console.error('user view', error.message)
    res.status(500).send('Server error')
  }
})

export default router
