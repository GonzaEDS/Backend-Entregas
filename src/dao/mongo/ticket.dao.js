import TicketModel from './models/tickets.model.js'
import ProductsService from '../../services/products.service.js'
import CartService from '../../services/carts.service.js'
import UsersService from '../../services/users.service.js'

class TicketDao {
  constructor() {
    this.productService = new ProductsService()
    this.cartService = new CartService()
    this.userService = new UsersService()
  }

  async createTicket(userId, successfulProducts) {
    const user = await this.userService.getUserById(userId)
    const amount = successfulProducts.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    )
    const ticketData = {
      purchaser: user.email,
      amount: amount,
      purchase_datetime: new Date()
    }

    const ticket = new TicketModel(ticketData)
    await ticket.save()

    return ticket
  }
}

export default TicketDao
