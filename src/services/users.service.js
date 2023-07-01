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
  async requestPasswordReset(email) {
    await this.initialized
    return this.userManager.requestPasswordReset(email)
  }
  async getUserByToken(token) {
    await this.initialized
    return this.userManager.getUserByToken(token)
  }
  async updatePassword(userId, newPassword) {
    await this.initialized
    return this.userManager.updatePassword(userId, newPassword)
  }
  async resetPassword(token, newPassword) {
    await this.initialized
    return this.userManager.resetPassword(token, newPassword)
  }
}

export default UsersService
