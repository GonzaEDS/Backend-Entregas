import DaoFactory from '../dao/daoFactory.js'

class TicketService {
  constructor() {
    this.initialized = this.initialize()
  }

  async initialize() {
    this.ticketDao = await DaoFactory.getDao('ticket')
  }
  async createTicket(userId, successfulProducts) {
    await this.initialized
    return this.ticketDao.createTicket(userId, successfulProducts)
  }
}

export default TicketService
