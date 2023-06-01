import { promises as fs } from 'fs'
import UsersService from '../../services/users.service.js'

class TicketDaoFS {
  constructor(fileName) {
    this.filename = `./src/dao/filesystem/storage/${fileName}`
    this.userService = new UsersService()
  }

  async readFile() {
    const data = await fs.readFile(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  async writeFile(data) {
    await fs.writeFile(this.filename, JSON.stringify(data, null, 2))
  }

  async createTicket(userId, successfulProducts) {
    let tickets = await this.readFile()

    const user = await this.userService.getUserById(userId)
    const amount = successfulProducts.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    )
    const purchase_datetime = new Date()

    // find the max _id and increment by one
    const maxId = tickets.reduce((max, ticket) => Math.max(max, ticket._id), 0)
    const newTicket = {
      _id: maxId + 1,
      purchaser: user.email,
      amount: amount,
      purchase_datetime: purchase_datetime
    }

    tickets.push(newTicket)

    await this.writeFile(tickets)

    return newTicket
  }
}

export default TicketDaoFS
