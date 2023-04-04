import { v4 as uuidv4 } from 'uuid'
const uuid = uuidv4()
import productModel from './models/products.model.js'

class ProductManager {
  async saveProduct(
    title,
    description,
    price,
    thumbnail,
    stock,
    category = 'Unclassified',
    status = true
  ) {
    if (!title || !description || !price || !thumbnail || !stock) {
      throw new Error('All fields are required')
    }

    const product = new productModel({
      title,
      description,
      price,
      thumbnail,
      category,
      stock,
      code: uuidv4(),
      status
    })

    await product.save()
    return product
  }

  async getById(id) {
    try {
      const product = await productModel.findById(id)
      if (product) {
        return product
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getAll(limit, page, sortPrice, qCategory, qStatus) {
    try {
      // Prepare the pagination options
      let options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
      }
      if (sortPrice) {
        options = {
          ...options,
          sort: { price: sortPrice }
        }
      }

      // Apply the search query if present

      let searchQuery = qCategory ? { category: qCategory } : {}

      if (qStatus !== undefined) {
        searchQuery = {
          ...searchQuery,
          status: qStatus
        }
      }

      // Paginate the results
      const result = await productModel.paginate(searchQuery, options)

      return result
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOne() {
    try {
      const count = await productModel.countDocuments()
      const random = parseInt(Math.random() * count)
      const product = await productModel.findOne().skip(random)
      return product
    } catch (err) {
      throw new Error(err)
    }
  }

  async putById(id, prop) {
    try {
      const product = await productModel.findByIdAndUpdate(id, prop, {
        new: true
      })
      if (product) {
        return product
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async findProductByCode(code) {
    try {
      const product = await productModel.findOne({ code: code }).lean()
      const id = product._id.toString()

      if (product) {
        return id
      } else {
        console.log('Product not found')
        return null
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async deleteById(id) {
    try {
      const product = await productModel.findByIdAndDelete(id)
      if (product) {
        return product.id
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async deleteAll() {
    try {
      await productModel.deleteMany({})
    } catch (err) {
      throw new Error(err)
    }
  }
}

let products = new ProductManager()

export default products