import { Router } from 'express'
import axios from 'axios'
import users from '../../dao/user.manager.js'
import requireAuth from '../../middlewares/authMiddleware.js'
const router = Router()

axios.defaults.baseURL = 'http://localhost:3000/'

router.get('/', requireAuth, async (req, res) => {
  try {
    const cid = req.session.cartId
    console.log(`CART.VIE.JS
    
    SESSION ${JSON.stringify(req.session)},
    REQ.SESSION.CARTID ${req.session.cartId}
    
    `)

    // const response = await axios.get(`api/users/${uid}`)

    const response = await axios.get(`api/carts/${cid}`)
    console.log('cart.view.js response', response.data)

    const cartItems = response.data
    let total
    if (cartItems.length > 1) {
      const prices = cartItems.map(prod => {
        return prod.product.price * prod.quantity
      })

      total = prices.reduce((acc, curr) => acc + curr)
    }

    const noItems = cartItems.length < 1
    res.render('cart', {
      cartItems,
      noItems,
      total,
      cid
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

router.post('/:pid', requireAuth, async (req, res) => {
  try {
    const { pid } = req.params
    console.log('cart.view.js pid:', pid)
    const uid = req.session.userId
    console.log('cart.view.js uid', uid)
    const cid = await users.getCartByUserId(uid)
    const post = axios.post(`/api/carts/${cid}/product/${pid}`)
    console.log(post)
    res.redirect('/cart')
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router

// router.get('/:cid', async (req, res) => {
//   try {
//     const { cid } = req.params

//     const response = await axios.get(`api/carts/${cid}`)
//     const cartItems = response.data
//     console.log('CARTITEMS', cartItems)

//     const prices = cartItems.map(prod => prod.product.price)

//     const total = prices.reduce((acc, curr) => acc + curr)

//     const noItems = cartItems.length < 1
//     res.render('cart', {
//       cartItems,
//       noItems,
//       total
//     })
//   } catch (error) {
//     console.error(error.message)
//     res.status(500).send('Server error')
//   }
// })
