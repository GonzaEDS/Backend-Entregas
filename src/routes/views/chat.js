import { Router } from 'express'
import axios from '../../config/axios.instance.js'
import requireAuth from '../../middlewares/authMiddleware.js'
const router = Router()

router.get('/', requireAuth(['user']), async (req, res) => {
  try {
    const response = await axios.get('/api/chat')
    const data = response.data
    const noMessages = data < 1
    res.render('chat', { messagesData: data, noMessages: noMessages })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
