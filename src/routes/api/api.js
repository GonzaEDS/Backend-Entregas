import { Router } from 'express'
const router = Router()
import products from './products.router.js'
import carts from './carts.router.js'
import chat from './chat.router.js'
import users from './users.router.js'
import mockingproducts from './mockingproducts.router.js'
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
  .use('/users', users)
  .use('/mockingproducts', mockingproducts)

export default router
