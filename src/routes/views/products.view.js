import { Router } from 'express'
import axios from 'axios'
const router = Router()
import products from '../../dao/product.manager.js'

axios.defaults.baseURL = 'http://localhost:3000/'

router.get('/', async (req, res) => {
  try {
    const queryParams = req.query
    const response = await axios.get('/api/products', {
      params: queryParams
    })
    const data = response.data
    const noProducts = data.docs < 1
    res.render('products', {
      productsData: data.docs,
      noProducts: noProducts
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params
    const id = await products.findProductByCode(code)

    const response = await axios.get(`/api/products/${id}`)
    const data = response.data
    res.render('productDetail', {
      product: data
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
