import { Router } from 'express'
import axios from 'axios'
const router = Router()

axios.defaults.baseURL = 'http://localhost:3000/'

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params

    const response = await axios.get(`api/carts/${cid}`)
    const cartItems = response.data
    console.log('CARTITEMS', cartItems)

    const prices = cartItems.map(prod => prod.product.price)

    const total = prices.reduce((acc, curr) => acc + curr)

    const noItems = cartItems.length < 1
    res.render('cart', {
      cartItems,
      noItems,
      total
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
