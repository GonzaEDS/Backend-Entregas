import DaoFactory from '../dao/daoFactory.js'

class CartService {
  constructor() {
    this.initialized = this.initialize()
  }

  async initialize() {
    this.cartManager = await DaoFactory.getDao('cart')
  }

  async newCart() {
    await this.initialized
    return this.cartManager.newCart()
  }

  async getById(id) {
    await this.initialized
    return this.cartManager.getById(id)
  }

  async getCartProducts(cid) {
    await this.initialized
    return this.cartManager.getCartProducts(cid)
  }

  async addProduct(cid, pid) {
    await this.initialized
    return this.cartManager.addProduct(cid, pid)
  }

  async deleteById(cid) {
    await this.initialized
    return this.cartManager.deleteById(cid)
  }

  async deleteProduct(cid, id_product) {
    await this.initialized
    return this.cartManager.deleteProduct(cid, id_product)
  }

  async updateCartProducts(cid, products) {
    await this.initialized
    return this.cartManager.updateCartProducts(cid, products)
  }

  async updateProductQuantity(cid, pid, quantity) {
    await this.initialized
    return this.cartManager.updateProductQuantity(cid, pid, quantity)
  }
  async removeProductsFromCart(cid, productIds) {
    await this.initialized
    return this.cartManager.removeProductsFromCart(cid, productIds)
  }
}

export default CartService
