//import userManager from '../dao/mongo/user.manager.js'
import DaoFactory from '../dao/daoFactory.js'

class UsersService {
  constructor() {
    this.initialized = this.initialize()
  }

  async initialize() {
    this.userManager = await DaoFactory.getDao('user')
  }

  async registerUser(user) {
    await this.initialized
    return {
      status: 'success',
      message: 'User registered',
      user: { _id: user._id, username: user.username, email: user.email }
    }
  }

  async getUserById(userId) {
    await this.initialized
    return this.userManager.getUserById(userId)
  }
}

export default UsersService
