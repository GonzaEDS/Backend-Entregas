import { Router } from 'express'
const router = Router()
import home from './home.js'
import realTimeProducts from './realTimeProducts.js'
import chat from './chat.js'
import products from './products.view.js'
import cart from './cart.view.js'
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
  .use('/products', products)
  .use('/cart', cart)

export default router
