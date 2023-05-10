import userManager from '../dao/user.manager.js'

class UsersService {
  async registerUser(user) {
    return {
      status: 'success',
      message: 'User registered',
      user: { _id: user._id, username: user.username, email: user.email }
    }
  }

  async getUserById(userId) {
    return await userManager.getUserById(userId)
  }
}

export default UsersService
