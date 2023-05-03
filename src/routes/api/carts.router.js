import { Router } from 'express'
import passport from 'passport'
const router = Router()
import carts from '../../dao/cart.manager.js'
import requireAuth from '../../middlewares/authMiddleware.js'

// router.use(passport.authenticate('jwt', { session: false }))

const authMiddleware = passport.authenticate('jwt', { session: false })

function validateProductArray(req, res, next) {
  const products = req.body

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Products should be an array.' })
  }

  const invalidProducts = products.filter(product => {
    return (
      !product ||
      typeof product !== 'object' ||
      typeof product.product !== 'string' ||
      typeof product.quantity !== 'number' ||
      Object.keys(product).length !== 2
    )
  })

  if (invalidProducts.length > 0) {
    return res.status(400).json({ error: 'Invalid product format.' })
  }

  next()
}

router.post('/', async (_req, res) => {
  try {
    console.log('**** INSIDE router.post/carts *****')
    const new_Cart = await carts.newCart()
    console.log('carts.router.js', new_Cart)
    const id = new_Cart._id.toString()
    res.status(200).send({ id })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/oneCart/:id', async (req, res) => {
  let { id } = req.params
  try {
    let data = await carts.getById(id)
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.e(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/:cid', authMiddleware, async (req, res) => {
  try {
    // const cid = req.user.cartId
    const { cid } = req.params

    let getCartProducts
    if (cid === 'admin') {
      return res.status(200).send({ cartItems: [], admin: true })
    } else {
      getCartProducts = await carts.getCartProducts(cid)
    }

    if (getCartProducts) {
      return res.status(200).send({ cartItems: getCartProducts })
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  console.log(cid, pid)
  try {
    const addedProd = await carts.addProduct(cid, pid)
    res.status(200).send({ id: addedProd })
  } catch (error) {
    console.error(error.message)
    // res.status(400).json({
    //   response: 'error'
    // })
  }
})

router.delete('/', async (req, res) => {
  const cid = req.user.cartId
  try {
    let deletedCart = await carts.deleteById(cid)
    if (deletedCart) {
      res.status(200).json({
        response: `cart ${deletedCart} deleted`
      })
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.delete('/:cid/products/:id_product', requireAuth, async (req, res) => {
  const { cid, id_product } = req.params
  try {
    const deletedProduct = await carts.deleteProduct(cid, id_product)
    if (deletedProduct) {
      return res.status(200).send({ id: deletedProduct })
    }
    return res.status(404).json({
      response: 'can not find'
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.put('/', validateProductArray, async (req, res) => {
  const cid = req.user.cartId
  const products = req.body
  try {
    const updatedCart = await carts.updateCartProducts(cid, products)
    if (updatedCart) {
      res.status(200).send(updatedCart)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.put('/products/:pid', requireAuth, async (req, res) => {
  const cid = req.user.cartId

  const { pid } = req.params
  const { quantity } = req.body

  try {
    const updatedCart = await carts.updateProductQuantity(cid, pid, quantity)

    if (updatedCart) {
      res.status(200).send(updatedCart)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

export default router
