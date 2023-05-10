import productsDAO from '../dao/product.manager.js'

class ProductsService {
  async createProduct(title, description, price, thumbnail, stock, category) {
    return await productsDAO.saveProduct(
      title,
      description,
      price,
      thumbnail,
      stock,
      category
    )
  }

  async updateProductById(pid, productData) {
    return await productsDAO.putById(pid, productData)
  }

  async deleteProductById(pid) {
    return await productsDAO.deleteById(pid)
  }

  async getAllProducts(limit, page, sort, categoryRegex, status) {
    return await productsDAO.getAll(limit, page, sort, categoryRegex, status)
  }

  async getProductById(pid) {
    return await productsDAO.getById(pid)
  }
}

export default ProductsService
