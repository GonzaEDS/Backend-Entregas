import { Router } from 'express'
const router = Router()
import carts from '../../dao/cart.manager.js'
import requireAuth from '../../middlewares/authMiddleware.js'
router.post('/', async (_req, res) => {
  try {
    const new_Cart = await carts.newCart()
    const id = new_Cart._id.toString()
    res.status(200).send({ id })
  } catch (error) {
    console.log(error)
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

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get('/:cid', async (req, res) => {
  try {
    let { cid } = req.params
    const getCartProducts = await carts.getCartProducts(cid)
    if (getCartProducts) {
      res.status(200).send(getCartProducts)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato...
router.post('/:cid/product/:pid', async (req, res) => {
  let { cid, pid } = req.params
  try {
    const addedProd = await carts.addProduct(cid, pid)
    res.status(200).send({ id: addedProd })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.delete('/:id', async (req, res) => {
  let { id } = req.params
  try {
    let deletedCart = await carts.deleteById(id)
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
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.delete('/:id_cart/products/:id_product', async (req, res) => {
  try {
    let { id_cart, id_product } = req.params
    console.log(id_cart, id_product)
    const deletedProduct = await carts.deleteProduct(id_cart, id_product)
    // if (deletedProduct) {
    //   res.status(200).send({ id: deletedProduct })
    // }
    // res.status(404).json({
    //   response: 'can not find'
    // })
    if (deletedProduct) {
      return res.status(200).send({ id: deletedProduct })
    }
    return res.status(404).json({
      response: 'can not find'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de
//productos con el formato especificado

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

router.put('/:cid', validateProductArray, async (req, res) => {
  try {
    const { cid } = req.params
    const products = req.body
    const updatedCart = await carts.updateCartProducts(cid, products)
    if (updatedCart) {
      res.status(200).send(updatedCart)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

/* 
↑ Ejemplo de cómo recibe la información desde el body:

[
  {
    "product": "6427d5ed140b26b74647bb30",
    "quantity": 10
  },
  {
    "product": "6427d5ed140b26b74647bb3a",
    "quantity": 1
  }
] 
*/

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO
//la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const { quantity } = req.body

    const updatedCart = await carts.updateProductQuantity(cid, pid, quantity)

    if (updatedCart) {
      res.status(200).send(updatedCart)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

export default router
