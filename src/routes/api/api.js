import { Router } from 'express'
const router = Router()
import products from './products.router.js'
import carts from './carts.router.js'
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

export default router
