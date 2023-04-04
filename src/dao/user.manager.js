const User = require('./user.model')

class UserManager {
  async createUser(email, password) {
    try {
      const user = new User({
        email,
        password
      })
      await user.save()
      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  async getUserByEmail(email) {
    return await User.findOne({ email })
  }

  async getUserById(id) {
    return await User.findById(id)
  }
}

module.exports = UserManager
