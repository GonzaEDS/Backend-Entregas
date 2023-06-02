import ProductsService from '../services/products.service.js'
import { socketExport } from '../../socket/configureSocket.js'
import CustomError from '../errors/custom.error.js'
import ErrorEnum from '../errors/error.enum.js'

class ProductsController {
  #service

  constructor(service) {
    this.#service = service
  }

  async create(req, res, next) {
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

      res.okResponse(data)
    } catch (error) {
      next(
        new CustomError({
          name: 'Create Product Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.BAD_REQUEST
        })
      )
    }
  }

  async updateById(req, res, next) {
    let { pid } = req.params
    if (Object.keys(req.body)[0] == 'id') {
      return res.userErrorResponse('Cannot modify the id of a product')
    }
    try {
      let data = await this.#service.updateProductById(pid, req.body)

      if (data) {
        res.okResponse(data)
      } else {
        next(
          new CustomError({
            name: 'Update Product Error',
            cause: new Error('Product not found'),
            message: 'Product not found',
            code: ErrorEnum.NOT_FOUND
          })
        )
      }
    } catch (error) {
      next(
        new CustomError({
          name: 'Update Product Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.BAD_REQUEST
        })
      )
    }
  }

  async deleteById(req, res, next) {
    let { pid } = req.params
    try {
      let data = await this.#service.deleteProductById(pid)
      if (data) {
        res.okResponse('Product deleted')
      } else {
        next(
          new CustomError({
            name: 'Delete Product Error',
            cause: new Error('Product not found'),
            message: 'Product not found',
            code: ErrorEnum.NOT_FOUND
          })
        )
      }
    } catch (error) {
      next(
        new CustomError({
          name: 'Delete Product Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.BAD_REQUEST
        })
      )
    }
  }

  async getAll(req, res, next) {
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

      if (data) {
        res.okResponse(data)
      } else {
        next(
          new CustomError({
            name: 'Get All Products Error',
            cause: new Error('No products found'),
            message: 'No products found',
            code: ErrorEnum.NOT_FOUND
          })
        )
      }
    } catch (error) {
      next(
        new CustomError({
          name: 'Get All Products Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.BAD_REQUEST
        })
      )
    }
  }

  async getById(req, res, next) {
    let { pid } = req.params
    try {
      let data = await this.#service.getProductById(pid)
      if (data) {
        res.okResponse(data)
      } else {
        next(
          new CustomError({
            name: 'Get Product Error',
            cause: new Error('Product not found'),
            message: 'Product not found',
            code: ErrorEnum.NOT_FOUND
          })
        )
      }
    } catch (error) {
      next(
        new CustomError({
          name: 'Get Product Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.BAD_REQUEST
        })
      )
    }
  }

  async mockingProducts(req, res, next) {
    try {
      const mockProducts = await this.#service.generateMockProducts(100)
      res.okResponse(mockProducts)
    } catch (error) {
      next(
        new CustomError({
          name: 'Mocking Products Error',
          cause: error,
          message: error.message,
          code: ErrorEnum.SERVER_ERROR
        })
      )
    }
  }
}

const controller = new ProductsController(new ProductsService())
export default controller
