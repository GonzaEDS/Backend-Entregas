import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/'

import userModel from './models/users.model.js'

class UserManager {
  async registerUser(username, email, password) {
    try {
      // Check if the user already exists
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
      })
      if (existingUser) {
        throw new Error('Username or email already in use')
      }

      const createdCart = await axios.post('/api/carts')
      const cartId = createdCart.data.id

      // Create the new user
      const newUser = await userModel.create({
        username,
        email,
        password,
        cartId
      })

      // Generate a JWT token for the new user
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET)

      return { token, user: newUser.toObject() }
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async loginUser(email, password) {
    try {
      // Find the user by email
      const user = await userModel.findOne({ email })
      if (!user) {
        throw new Error('Email or password is incorrect')
      }

      // Check if the password is correct
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        throw new Error('Email or password is incorrect')
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

      return { token, user: user.toObject() }
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async getUserById(userId) {
    try {
      const user = await userModel.findById(userId).populate('cartId')
      return user ? user.toObject() : null
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
  async getCartByUserId(userId) {
    try {
      const user = await userModel.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      return user.cartId
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
}

const users = new UserManager()

export default users
