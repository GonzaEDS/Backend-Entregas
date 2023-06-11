import { Router } from 'express'
import axios from '../../config/axios.instance.js'
import requireAuth from '../../middlewares/authMiddleware.js'
const router = Router()

router.get('/', requireAuth('admin'), async (req, res) => {
  try {
    const queryParams = req.query
    const response = await axios.get('/api/products', {
      params: queryParams
    })
    const data = response.data.payload
    const { docs, ...paginationOptions } = data
    const noProducts = data.docs < 1
    res.render('realTimeProducts', {
      productsData: data.docs,
      noProducts: noProducts,
      pagination: paginationOptions
    })
  } catch (error) {
    req.logger.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
