import { Router } from 'express'
import axios from '../../config/axios.instance.js'
//import users from '../../dao/mongo/user.dao.js'
import DaoFactory from '../../dao/daoFactory.js'
const users = await DaoFactory.getDao('user')
import requireAuth from '../../middlewares/authMiddleware.js'
import jwt from 'jsonwebtoken'
const router = Router()

router.get('/', requireAuth(['user']), async (req, res) => {
  try {
    // const cid = req.session.passport.user.cartId

    const cid = req.user.cartId
    console.log('cart view req.user', req.user)
    console.log('cart view cid:', cid)

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
    console.log(JSON.stringify(response.data))

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

router.post('/:pid', requireAuth(['user']), async (req, res) => {
  try {
    const { pid } = req.params
    console.log('cart.view router.post', req.params)
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

router.get('/checkout', requireAuth(['user']), async (req, res) => {
  try {
    const cid = req.user.cartId

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
    let total = 0
    if (cartItems.length > 0) {
      total = cartItems
        .reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0)
        .toFixed(2)
    }
    const email = req.user.email

    res.render('checkout', {
      cartItems,
      total,
      cid,
      email
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

router.get('/ticket', requireAuth(['user']), async (req, res, next) => {
  const cid = req.user.cartId
  const jwtToken = jwt.sign(
    { _id: req.user._id, cartId: req.user.cartId },
    process.env.JWT_SECRET
  )

  try {
    const response = await axios.post(
      `/api/carts/${cid}/purchase`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    res.render('ticket', { ...response.data })
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // If it's a 400 error, render the 'ticket' view with the error data
      res.render('ticket', { ...err.response.data })
    } else {
      // For other errors, you might want to handle them differently...
      next(err)
    }
  }
})

export default router
