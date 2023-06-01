import mongoose from 'mongoose'
import config from '../config/dao.config.js'

class DaoFactory {
  static async getDao(type) {
    switch (config.persistence) {
      case 'mongo':
        await mongoose.connect(
          config.MONGODB_URI || 'mongodb://localhost/ecommerce',
          { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log('Connected to MongoDB Atlas')

        switch (type) {
          case 'product':
            const { default: ProductService } = await import(
              './mongo/product.dao.js'
            )
            return new ProductService()
          case 'user':
            const { default: UserService } = await import('./mongo/user.dao.js')
            return new UserService()
          case 'cart':
            const { default: CartService } = await import('./mongo/cart.dao.js')
            return new CartService()
          case 'ticket':
            const { default: TicketService } = await import(
              './mongo/ticket.dao.js'
            )
            return new TicketService()
          //
          default:
            throw new Error('Invalid type for DAO')
        }

      case 'filesystem':
        switch (type) {
          case 'product':
            const { default: ProductServiceFS } = await import(
              './filesystem/product.dao.js'
            )
            return new ProductServiceFS('products.json')
          case 'user':
            const { default: UserServiceFS } = await import(
              './filesystem/user.dao.js'
            )
            return new UserServiceFS('users.json')
          case 'cart':
            const { default: CartServiceFS } = await import(
              './filesystem/cart.dao.js'
            )
            return new CartServiceFS('carts.json')
          case 'ticket':
            const { default: TicketServiceFS } = await import(
              './filesystem/ticket.dao.js'
            )
            return new TicketServiceFS('tickets.json')
          //
          default:
            throw new Error('Invalid type for DAO')
        }

      default:
        throw new Error('Wrong persistence type in config')
    }
  }
}

export default DaoFactory
