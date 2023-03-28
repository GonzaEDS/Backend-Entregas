import cartModel from './models/carts.model.js'

class CartsManager {
  async newCart() {
    try {
      const newCart = await cartModel.create({ products: [] })
      return newCart.toObject()
    } catch (error) {
      console.error(error)
    }
  }

  async deleteById(num) {
    try {
      const id = parseInt(num)
      const deletedCart = await cartModel.findOneAndDelete({ _id: id }).lean()
      if (deletedCart) {
        return num
      } else {
        console.log(`ID "${num}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getCartProducts(num) {
    try {
      const id = parseInt(num)
      const requestedCart = await cartModel
        .findById(id)
        .populate('products.product')
        .lean()
      if (requestedCart) {
        return requestedCart.products
      }
      return null
    } catch (error) {
      console.log(error)
    }
  }

  async addProduct(cartId, prodId) {
    cartId = parseInt(cartId)
    prodId = parseInt(prodId)

    const requestedCart = await cartModel.findById(cartId).lean()

    const prodAlreadyInCart = requestedCart.products.some(
      prod => prod.product == prodId
    )

    if (prodAlreadyInCart) {
      const updatedProducts = requestedCart.products.map(prod => {
        if (prod.product == prodId) {
          prod.quantity++
        }
        return prod
      })

      await cartModel.findByIdAndUpdate(cartId, { products: updatedProducts })
    } else {
      const newProduct = { product: prodId, quantity: 1 }
      requestedCart.products.push(newProduct)

      await cartModel.findByIdAndUpdate(cartId, {
        products: requestedCart.products
      })
    }

    return cartId
  }

  async deleteProduct(id_cart, id_product) {
    id_cart = parseInt(id_cart)
    id_product = parseInt(id_product)

    const requestedCart = await cartModel.findById(id_cart).lean()

    const productToDeleteIndex = requestedCart.products.findIndex(
      product => product.product == id_product
    )

    if (productToDeleteIndex !== -1) {
      requestedCart.products.splice(productToDeleteIndex, 1)

      await cartModel.findByIdAndUpdate(id_cart, {
        products: requestedCart.products
      })

      return id_product
    }

    return null
  }
}

const carts = new CartsManager()

export default carts
