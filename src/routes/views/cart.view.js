import { Router } from 'express'
import axios from '../../config/axios.instance.js'
import users from '../../dao/user.manager.js'
import requireAuth from '../../middlewares/authMiddleware.js'
import jwt from 'jsonwebtoken'
const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    // const cid = req.session.passport.user.cartId

    const cid = req.user.cartId

    // const response = await axios.get(`api/carts/${cid}`)

    const jwtToken = jwt.sign(
      { _id: req.user._id, cartId: req.user.cartId },
      process.env.JWT_SECRET
    )

    const response = await axios.get(`api/carts/${cid}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })

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
    const uid = req.user._id

    const cid = await users.getCartByUserId(uid)

    const jwtToken = jwt.sign(
      { _id: req.user._id, cartId: req.user.cartId },
      process.env.JWT_SECRET
    )
    const post = axios.post(`/api/carts/${cid}/product/${pid}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
    res.redirect('/cart')
  } catch (error) {
    console.error('cart.view.js /cart/:pid', error.message)
    res.status(500).send('Server error')
  }
})

export default router
