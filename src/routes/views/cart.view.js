import { Router } from 'express'
import axios from '../../config/axios.instance.js'
import users from '../../dao/user.manager.js'
import requireAuth from '../../middlewares/authMiddleware.js'
const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const cid = req.session.passport.user.cartId

    const response = await axios.get(`api/carts/${cid}`)

    const cartItems = response.data.cartItems
    const admin = response.data.admin
    let total
    if (cartItems.length > 0) {
      const prices = cartItems.map(prod => {
        return prod.product.price * prod.quantity
      })

      total = prices.reduce((acc, curr) => acc + curr)
      total = total.toFixed(2)
    }

    const noItems = cartItems.length < 1
    res.render('cart', {
      cartItems,
      noItems,
      total,
      cid,
      admin
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

router.post('/:pid', requireAuth, async (req, res) => {
  try {
    const { pid } = req.params
    const uid = req.session.passport.user.userId
    const cid = await users.getCartByUserId(uid)
    const post = axios.post(`/api/carts/${cid}/product/${pid}`)
    res.redirect('/cart')
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
