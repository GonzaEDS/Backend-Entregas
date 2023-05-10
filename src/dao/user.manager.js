import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from '../../src/config/axios.instance.js'
import userModel from './models/users.model.js'

class UserManager {
  async registerUser(res, username, email, password) {
    try {
      // Check if the user already exists
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
      })
      if (existingUser) {
        return { message: 'Email or username already in use' }
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
      // const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET)
      const token = jwt.sign(
        { _id: newUser._id, cartId: newUser.cartId },
        process.env.JWT_SECRET
      )
      res.cookie('AUTH', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })

      return { token, user: newUser.toObject() }
    } catch (error) {
      console.error(error.message)
    }
  }

  async loginUser(res, email, password) {
    try {
      // Check if the user is the hardcoded admin
      if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        const adminUser = {
          _id: 'admin',
          email,
          role: 'admin',
          username: 'admin'
        }
        //const token = jwt.sign({ _id: email }, process.env.JWT_SECRET)
        const token = jwt.sign(
          { _id: user._id, cartId: user.cartId },
          process.env.JWT_SECRET
        )

        //Generate a JWT token for the user

        res.cookie('AUTH', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })

        return { token, user: adminUser }
      }

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

      const token = jwt.sign(
        { _id: user._id, cartId: user.cartId },
        process.env.JWT_SECRET
      )

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      }

      return { token, user: user.toObject(), cookieOptions }
    } catch (error) {
      console.error(error.message)
      return { message: error.message }
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
