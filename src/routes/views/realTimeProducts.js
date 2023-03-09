import { Router } from 'express'
import axios from 'axios'
const router = Router()

axios.defaults.baseURL = 'http://localhost:3000/'
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('/api/products')
    const data = response.data
    const noProducts = data < 1
    res.render('realTimeProducts', {
      productsData: data,
      noProducts: noProducts
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
