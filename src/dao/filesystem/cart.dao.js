import { promises as fs } from 'fs'
import ProductDaoFS from './product.dao.js'

class CartDaoFS {
  constructor(fileName) {
    this.filename = `./src/dao/filesystem/storage/${fileName}`
    this.count = 0
  }

  async readFile() {
    const data = await fs.readFile(this.filename, 'utf8')
    return JSON.parse(data)
  }

  async writeFile(data) {
    await fs.writeFile(this.filename, JSON.stringify(data, null, 2))
  }

  async newCart() {
    let carts = await this.readFile()

    if (carts.length > 0) {
      this.count = [...carts].pop().id
    }

    const newCart = {
      id: this.count + 1,
      products: []
    }

    carts.push(newCart)
    this.count++
    await this.writeFile(carts)
    return newCart
  }

  async deleteById(num) {
    let carts = await this.readFile()
    const id = parseInt(num)
    const foundIndex = carts.findIndex(cart => cart.id === id)

    if (foundIndex !== -1) {
      carts.splice(foundIndex, 1)
      await this.writeFile(carts)
      return num
    } else {
      console.log(`ID "${num}" not found`)
      return null
    }
  }

  async getCartProducts(num) {
    try {
      const products = new ProductDaoFS('products.json')
      let carts = await this.readFile()
      const id = parseInt(num)
      const requestedCart = carts.find(cart => cart.id == id)

      if (!requestedCart) return null

      const populatedProducts = []
      for (const cartProduct of requestedCart.products) {
        const product = await products.getById(cartProduct.product)
        if (product) {
          populatedProducts.push({ ...cartProduct, product })
        } else {
          populatedProducts.push(cartProduct)
        }
      }

      requestedCart.products = populatedProducts
      return requestedCart.products
    } catch (error) {
      console.error(error.message)
    }
  }

  async addProduct(cartId, prodId) {
    cartId = parseInt(cartId)
    prodId = parseInt(prodId)
    let carts = await this.readFile()
    let requestedCart = carts.find(cart => cart.id == cartId)

    const prodAlreadyInCart = requestedCart.products.some(
      prod => prod.product == prodId
    )
    if (prodAlreadyInCart) {
      let requestedProd = requestedCart.products.find(
        prod => prod.product == prodId
      )
      const newQuantity = requestedProd.quantity + 1
      const updatedProd = {
        product: requestedProd.product,
        quantity: newQuantity
      }

      const updatedProducts = requestedCart.products.map(prod => {
        if (prod.product == prodId) {
          return updatedProd
        }
        return prod
      })
      requestedCart.products = updatedProducts
    } else {
      const newProduct = { product: prodId, quantity: 1 }
      requestedCart.products.push(newProduct)
    }

    const updatedCarts = carts.map(cart => {
      if (cart.id == requestedCart.id) {
        return requestedCart
      }
      return cart
    })

    await this.writeFile(updatedCarts)
    return requestedCart.id
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      cartId = parseInt(cartId)
      productId = parseInt(productId)
      quantity = parseInt(quantity)

      let carts = await this.readFile()

      let requestedCart = carts.find(cart => cart.id == cartId)
      if (!requestedCart) {
        throw new Error(`Cart with id ${cartId} not found.`)
      }

      const productToUpdateIndex = requestedCart.products.findIndex(
        product => product.product == productId
      )
      if (productToUpdateIndex === -1) {
        throw new Error(`Product with id ${productId} not found in cart.`)
      }

      requestedCart.products[productToUpdateIndex].quantity = quantity

      const updatedCarts = carts.map(cart => {
        if (cart.id == requestedCart.id) {
          return requestedCart
        }
        return cart
      })

      await this.writeFile(updatedCarts)
      return requestedCart
    } catch (error) {
      console.error('updateProductQuantity', error)
      return null
    }
  }

  async deleteProduct(id_cart, id_product) {
    id_cart = parseInt(id_cart)
    id_product = parseInt(id_product)
    let carts = await this.readFile()
    const requestedCart = carts.find(cart => cart.id == id_cart)
    const productToDeleteIndex = requestedCart.products.findIndex(
      product => product.id == id_product
    )
    if (productToDeleteIndex !== -1) {
      requestedCart.products.splice(productToDeleteIndex, 1)
      const updatedCarts = carts.map(cart => {
        if (cart.id == id_cart) {
          return requestedCart
        }
        return cart
      })
      await this.writeFile(updatedCarts)
      return id_product
    }
    return null
  }

  async removeProductsFromCart(num, productIds) {
    try {
      let carts = await this.readFile()

      const cid = parseInt(num)
      console.log('carts', carts, 'cid', cid)
      let currentCart = carts.find(cart => cart.id === cid)

      if (!currentCart) {
        throw new Error('Cart not found')
      }

      currentCart.products = currentCart.products.filter(
        product => !productIds.includes(product.id)
      )

      carts = carts.map(c => (c.id === cid ? currentCart : c))

      await this.writeFile(carts)

      return currentCart
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
}

export default CartDaoFS
