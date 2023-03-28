import { Router } from 'express'
const router = Router()
import products from './products.router.js'
import carts from './carts.router.js'
import chat from './chat.router.js'
router
  .get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      healt: 'up',
      enviroment: process.env.ENVIROMENT || 'not found'
    })
  })
  .use('/products', products)
  .use('/carts', carts)
  .use('/chat', chat)

export default router
