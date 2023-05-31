import DaoFactory from '../dao/daoFactory.js'

class ProductsService {
  constructor() {
    this.initialized = this.initialize()
  }

  async initialize() {
    this.productsDAO = await DaoFactory.getDao('product')
  }

  async createProduct(title, description, price, thumbnail, stock, category) {
    await this.initialized
    return this.productsDAO.saveProduct(
      title,
      description,
      price,
      thumbnail,
      stock,
      category
    )
  }

  async updateProductById(pid, productData) {
    await this.initialized
    return this.productsDAO.putById(pid, productData)
  }

  async deleteProductById(pid) {
    await this.initialized
    return this.productsDAO.deleteById(pid)
  }

  async getAllProducts(limit, page, sort, categoryRegex, status) {
    await this.initialized
    return this.productsDAO.getAll(limit, page, sort, categoryRegex, status)
  }

  async getProductById(pid) {
    await this.initialized
    return this.productsDAO.getById(pid)
  }
  async adjustStock(pid, quantity) {
    await this.initialized
    return this.productsDAO.adjustStock(pid, quantity)
  }
}
export default ProductsService
