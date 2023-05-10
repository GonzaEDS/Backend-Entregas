import cartManager from '../dao/cart.manager.js'

class CartService {
  async newCart() {
    return cartManager.newCart()
  }

  async getById(id) {
    return cartManager.getById(id)
  }

  async getCartProducts(cid) {
    return cartManager.getCartProducts(cid)
  }

  async addProduct(cid, pid) {
    return cartManager.addProduct(cid, pid)
  }

  async deleteById(cid) {
    return cartManager.deleteById(cid)
  }

  async deleteProduct(cid, id_product) {
    return cartManager.deleteProduct(cid, id_product)
  }

  async updateCartProducts(cid, products) {
    return cartManager.updateCartProducts(cid, products)
  }

  async updateProductQuantity(cid, pid, quantity) {
    return cartManager.updateProductQuantity(cid, pid, quantity)
  }
}

export default CartService
