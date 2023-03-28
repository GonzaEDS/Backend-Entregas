import { promises as fs } from 'fs'

class CartsManager {
  constructor(fileName) {
    this.filename = `./src/models/${fileName}`
    this.count = 0
  }
  async newCart() {
    let carts = []
    try {
      carts = await fs.readFile(this.filename, 'utf-8')
      carts = JSON.parse(carts)
      if (carts.length > 0) {
        this.count = [...carts].pop().id
      }
      const newCart = {
        id: this.count + 1,
        products: []
      }
      carts.push(newCart)
      const cartStr = JSON.stringify(carts, null, 3)
      await fs.writeFile(this.filename, cartStr)
      return newCart
    } catch (error) {
      console.error(error)
    }
  }
  async deleteById(num) {
    try {
      const cartsData = await fs.readFile(this.filename, 'utf-8')
      const carts = JSON.parse(cartsData)
      const id = parseInt(num)
      const foundIndex = carts.findIndex(cart => cart.id === id)

      if (foundIndex !== -1) {
        carts.splice(foundIndex, 1)
        fs.writeFileSync(this.filename, JSON.stringify(carts, null, 2))
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
      const cartsData = await fs.readFile(this.filename, 'utf-8')
      const carts = JSON.parse(cartsData)
      const id = parseInt(num)
      const requestedCart = carts.find(cart => cart.id == id)
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
    const cartsData = await fs.readFile(this.filename, 'utf-8')
    const carts = JSON.parse(cartsData)
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

    await fs.writeFile(this.filename, JSON.stringify(updatedCarts, null, 2))

    return requestedCart.id
  }

  async deleteProduct(id_cart, id_product) {
    id_cart = parseInt(id_cart)
    id_product = parseInt(id_product)
    const cartsData = await fs.readFile(this.filename, 'utf-8')
    const carts = JSON.parse(cartsData)
    const requestedCart = carts.find(cart => cart.id == id_cart)
    const productToDeleteIndex = requestedCart.products.findIndex(
      product => product.id == id_product
    )
    if (productToDeleteIndex !== -1) {
      requestedCart.products.splice(productToDeleteIndex, 1)
      const updatedCarts = carts.map(cart => {
        if (cart.index == id_cart) {
          cart = requestedCart
        }
        return cart
      })
      fs.writeFileSync(this.filename, JSON.stringify(updatedCarts, null, 2))
      return id_product
    }
    return null
  }
}

let carts = new CartsManager('carts.json')

export default carts
