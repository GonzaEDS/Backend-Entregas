import { v4 as uuidv4 } from 'uuid'
const uuid = uuidv4()
import productModel from './models/products.model.js'

class ProductManager {
  async saveProduct(title, description, price, thumbnail, stock, status) {
    if (!title || !description || !price || !thumbnail || !stock) {
      console.log('All fields are required')
      return
    }

    if (!status) {
      status = true
    }

    const product = new productModel({
      title,
      description,
      price,
      thumbnail,
      stock,
      status,
      code: uuidv4()
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

  async getAll() {
    try {
      const products = await productModel.find({})
      return products
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
      const product = await productModel.findOne({ code: code })
      if (product) {
        return product.id
      } else {
        console.log('Product not found')
        return null
      }
    } catch (err) {
      throw new Error(err)
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
