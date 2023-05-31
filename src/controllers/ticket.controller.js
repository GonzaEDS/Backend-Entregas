import ProductsService from '../services/products.service.js'
import CartsService from '../services/carts.service.js'
import TicketService from '../services/ticket.service.js'
import mailer from '../config/mailer.js'

class TicketController {
  #ticketService
  #productsService
  #cartsService

  constructor(ticketService, productsService, cartsService) {
    this.#ticketService = ticketService
    this.#productsService = productsService
    this.#cartsService = cartsService
  }

  async create(req, res) {
    const { cid } = req.params
    const userId = req.user._id
    const cartProducts = await this.#cartsService.getCartProducts(cid)

    const notAvailableProducts = []
    const successfulProducts = []
    const successfulProductIds = []

    for (const item of cartProducts) {
      const product = item.product
      if (product.stock < item.quantity) {
        notAvailableProducts.push({ id: product._id, title: product.title })
      } else {
        successfulProducts.push({
          price: product.price,
          quantity: item.quantity
        })
        successfulProductIds.push(product._id)
        await this.#productsService.adjustStock(product._id, -item.quantity)
      }
    }
    if (notAvailableProducts.length > 0 && successfulProductIds.length === 0) {
      return res.status(400).json({
        message:
          'The products you requested are not available in the desired quantity.',
        notAvailableProducts
      })
    }

    await this.#cartsService.removeProductsFromCart(cid, successfulProductIds)
    const ticket = await this.#ticketService.createTicket(
      userId,
      successfulProducts
    )

    let message
    if (notAvailableProducts.length > 0 && successfulProductIds.length > 0) {
      message = 'Some products were not available in the desired quantity.'
    } else {
      message = 'All your products have been successfully purchased.'
    }
    if (ticket) {
      const userEmail = req.user.email
      const subject = 'Order Confirmation'
      const title = 'Hello, this is the confirmation of your order'
      const content = `Your ticket details: 
      Amount: ${ticket.amount},
      Purchaser: ${ticket.purchaser},
      Ticket code: ${ticket.code}`

      await mailer.sendMail(userEmail, subject, title, content) // send confirmation email
    }
    return res.status(201).json({
      ticket,
      message: message,
      notAvailableProducts
    })
  }
}

export default new TicketController(
  new TicketService(),
  new ProductsService(),
  new CartsService()
)
