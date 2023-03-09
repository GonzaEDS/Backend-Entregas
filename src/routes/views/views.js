import { Router } from 'express'
const router = Router()
import home from './home.js'
import realTimeProducts from './realTimeProducts.js'
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

export default router
