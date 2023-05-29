import ProductsService from '../services/products.service.js'
import { socketExport } from '../../socket/configureSocket.js'

class ProductsController {
  #service

  constructor(service) {
    this.#service = service
  }

  async create(req, res) {
    try {
      const { title, description, price, thumbnail, stock, category } = req.body
      let data = await this.#service.createProduct(
        title,
        description,
        price,
        thumbnail,
        stock,
        category
      )

      const socket = socketExport
      socket.emit('NEW_PRODUCT_SERVER', data)

      res.status(200).json({
        response: data
      })
    } catch (error) {
      console.log(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async updateById(req, res) {
    let { pid } = req.params
    if (Object.keys(req.body)[0] == 'id') {
      res.status(403).json({
        response: 'Can not modify the id of a product'
      })
    }
    try {
      let data = await this.#service.updateProductById(pid, req.body)

      if (data) {
        res.status(200).json({
          response: data
        })
      } else {
        res.status(404).json({
          respones: 'can not find'
        })
      }
    } catch (error) {
      console.log(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async deleteById(req, res) {
    let { pid } = req.params
    try {
      let data = await this.#service.deleteProductById(pid)
      if (data) {
        res.status(200).json({
          response: 'product deleted'
        })
      } else {
        res.status(404).json({
          response: 'can not find'
        })
      }
    } catch (error) {
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async getAll(req, res) {
    try {
      // Extract the pagination options from the query parameters
      const {
        limit = 9,
        page = 1,
        sort = '',
        category = '',
        status
      } = req.query || {}

      const regex = new RegExp(category.split('-').join(' '), 'i')

      // Call the getAll function with the pagination options
      const data = await this.#service.getAllProducts(
        limit,
        page,
        sort,
        regex,
        status
      )
      console.log(data)

      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).json({
          response: 'can not find'
        })
      }
    } catch (error) {
      console.log(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }

  async getById(req, res) {
    let { pid } = req.params
    try {
      let data = await this.#service.getProductById(pid)
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).json({
          response: 'can not find'
        })
      }
    } catch (error) {
      console.log(error.message)
      res.status(400).json({
        response: 'error'
      })
    }
  }
}

const controller = new ProductsController(new ProductsService())
export default controller
