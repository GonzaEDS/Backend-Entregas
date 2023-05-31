import cartModel from './models/carts.model.js'

class CartDao {
  async newCart() {
    try {
      const newCart = await cartModel.create({ products: [] })
      return newCart.toObject()
    } catch (error) {
      console.error(error.message)
    }
  }

  async deleteById(num) {
    try {
      const id = num
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

  async getCartProducts(cartId) {
    try {
      const requestedCart = await cartModel
        .findById(cartId)
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
  async updateCartProducts(cartId, products) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cartId, { products }, { new: true })
        .lean()

      return updatedCart
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const requestedCart = await cartModel.findById(cartId).lean()

      const updatedProducts = requestedCart.products.map(prod => {
        if (prod.product == productId) {
          prod.quantity = quantity
        }
        return prod
      })

      await cartModel.findByIdAndUpdate(
        cartId,
        { products: updatedProducts },
        { new: true }
      )

      const updatedCart = await cartModel
        .findById(cartId)
        .populate('products.product')
        .lean()

      return updatedCart
    } catch (error) {
      console.log('updateProductQuantity', error)
      return null
    }
  }
  //added for purchases
  async removeProductsFromCart(cid, productIds) {
    try {
      let cart = await this.getCartProducts(cid)
      cart = cart.filter(
        p => !productIds.map(String).includes(p.product._id.toString())
      )
      return this.updateCartProducts(cid, cart)
    } catch (err) {
      throw new Error(err)
    }
  }
}

// const carts = new CartDao()

export default CartDao
