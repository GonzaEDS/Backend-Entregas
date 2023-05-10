import CartService from '../services/carts.service.js'

class CartController {
  #service

  constructor(service) {
    this.#service = service
  }

  async create(req, res, next) {
    try {
      const new_Cart = await this.#service.newCart()
      const id = new_Cart._id.toString()
      res.status(200).send({ id })
    } catch (error) {
      console.error(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async getById(req, res, next) {
    let { id } = req.params
    try {
      let data = await this.#service.getById(id)
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).json({
          response: 'can not find'
        })
      }
    } catch (error) {
      console.error(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async getByCid(req, res, next) {
    try {
      const { cid } = req.params

      let getCartProducts
      if (cid === 'admin') {
        return res.status(200).send({ cartItems: [], admin: true })
      } else {
        getCartProducts = await this.#service.getCartProducts(cid)
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
  }

  async addProduct(req, res, next) {
    const { cid, pid } = req.params
    try {
      const addedProd = await this.#service.addProduct(cid, pid)
      res.status(200).send({ id: addedProd })
    } catch (error) {
      console.error(error.message)
    }
  }

  async deleteCart(req, res, next) {
    const cid = req.user.cartId
    try {
      let deletedCart = await this.#service.deleteById(cid)
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
  }

  async deleteProduct(req, res, next) {
    const { cid, id_product } = req.params
    try {
      const deletedProduct = await this.#service.deleteProduct(cid, id_product)
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
  }

  async updateCartProducts(req, res, next) {
    const cid = req.user.cartId
    const products = req.body
    try {
      const updatedCart = await this.#service.updateCartProducts(cid, products)
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
  }

  async updateProductQuantity(req, res, next) {
    const cid = req.user.cartId
    const { pid } = req.params
    const { quantity } = req.body

    try {
      const updatedCart = await this.#service.updateProductQuantity(
        cid,
        pid,
        quantity
      )

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
  }

  async validateProductArray(req, res, next) {
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
}

const controller = new CartController(new CartService())
export default controller
