import { Router } from 'express'
const router = Router()
import home from './home.js'
import realTimeProducts from './realTimeProducts.js'
import chat from './chat.js'
router
  .get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      healt: 'up',
      enviroment: process.env.ENVIROMENT || 'not found'
    })
  })
  .use('/', home)
  .use('/realTimeProducts', realTimeProducts)
  .use('/chat', chat)

export default router
