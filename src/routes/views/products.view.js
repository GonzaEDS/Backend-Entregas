import { Router } from 'express'
import axios from '../../config/axios.instance.js'
const router = Router()
//import products from '../../dao/mongo/product.dao.js'
import DaoFactory from '../../dao/daoFactory.js'
const products = await DaoFactory.getDao('product')

router.get('/', async (req, res) => {
  try {
    const queryParams = req.query
    const response = await axios.get('/api/products', {
      params: queryParams
    })

    const data = response.data.payload
    const { docs, ...paginationOptions } = data

    const noProducts = data.docs < 1
    res.render('products', {
      productsData: data.docs,
      noProducts: noProducts,
      pagination: paginationOptions
    })
  } catch (error) {
    req.logger.error(error.message)
    res.status(500).send('Server error')
  }
})

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params
    const id = await products.findProductByCode(code)

    const response = await axios.get(`/api/products/${id}`)
    const data = response.data.payload
    res.render('productDetail', {
      product: data
    })
  } catch (error) {
    req.logger.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
