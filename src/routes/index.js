import { Router } from 'express'
const router = Router()
import api from './api/api.js'
import views from './views/views.js'
router
  .get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      healt: 'up',
      enviroment: process.env.ENVIROMENT || 'not found'
    })
  })
  .use('/api', api)
  .use('/', views)

export default router
