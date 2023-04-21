import { Router } from 'express'
import axios from '../../config/axios.instance.js'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const queryParams = req.query
    const response = await axios.get('/api/products', {
      params: queryParams
    })
    const data = response.data
    const noProducts = data.docs < 1
    res.render('realTimeProducts', {
      productsData: data.docs,
      noProducts: noProducts
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
