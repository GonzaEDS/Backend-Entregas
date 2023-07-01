import UsersService from '../services/users.service.js'
import jwt from 'jsonwebtoken'

class UsersController {
  #service

  constructor(service) {
    this.#service = service
  }

  async register(req, res, next) {
    try {
      const user = req.user
      const data = await this.#service.registerUser(user)
      res.status(200).json(data)
    } catch (error) {
      req.logger.error(error.message)
    }
  }

  failureRegister(_req, res) {
    res.send({ error: 'error during registration' })
  }

  failureLogin(_req, res) {
    res.send({ error: 'error during login' })
  }

  async login(req, res, next) {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({ token, status: 'ok' })
  }

  logout(req, res) {
    res.clearCookie('AUTH')
    res.status(200).json({ message: 'Logged out successfully' })
  }

  async githubCallback(req, res, next) {
    const token = jwt.sign(
      { _id: req.user._id, cartId: req.user.cartId, role: req.user.role },
      process.env.JWT_SECRET
    )
    // Set the JWT as a cookie
    res.cookie('AUTH', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })
    res.redirect('/user')

    // res.status(200).json({ token })
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params
      const data = await this.#service.getUserById(userId)
      res.status(200).json(data)
    } catch (error) {
      req.logger.error(error.message)
      res.status(400).json({ response: 'error' })
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body
      const data = await this.#service.requestPasswordReset(email)
      res.status(200).json(data)
    } catch (error) {
      req.logger.error(error.message)
      res.status(400).json({ response: 'error' })
    }
  }
  async getUserByToken(req, res, next) {
    try {
      const { token } = req.params
      // Look for a user with the provided token and where the token has not yet expired
      const user = await this.#service.getUserByToken(token)
      // If there is a user with a valid token
      res.status(200).json(user)
    } catch (error) {
      req.logger.error(error.message)
      res.status(400).json({ response: 'error' })
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body
      const data = await this.#service.resetPassword(token, newPassword)
      res.status(200).json(data)
    } catch (error) {
      req.logger.error(error.message)
      res.status(400).json({ response: 'error' })
    }
  }
}

const usersController = new UsersController(new UsersService())
export default usersController
