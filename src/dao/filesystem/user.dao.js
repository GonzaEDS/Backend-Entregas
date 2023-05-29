import { promises as fs } from 'fs'
import bcrypt from 'bcrypt'
import CartDao from '../filesystem/cart.dao.js'
const cartDAO = new CartDao('carts.json')

import jwt from 'jsonwebtoken'
import axios from '../../config/axios.instance.js'

class UserDaoFS {
  constructor(fileName) {
    this.filename = `./src/dao/filesystem/storage/${fileName}`
    this.count = 0
  }

  async readFile() {
    const data = await fs.readFile(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  async writeFile(data) {
    await fs.writeFile(this.filename, JSON.stringify(data, null, 2))
  }

  async registerUser(res, username, email, password) {
    let users = await this.readFile()

    const existingUser = users.find(
      user => user.username === username || user.email === email
    )
    if (existingUser) {
      throw new Error('Email or username already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new cart for the user
    const createdCart = await cartDAO.newCart()
    console.log('createdCart:', createdCart)
    const cartId = createdCart.id

    const newUser = {
      _id: ++this.count,
      username,
      email,
      password: hashedPassword,
      cartId // Associate the cart id with the user
    }

    users.push(newUser)

    await this.writeFile(users)

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { _id: newUser._id, cartId: newUser.cartId },
      process.env.JWT_SECRET
    )
    res.cookie('AUTH', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    return { token, user: newUser }
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

        //Generate a JWT token for the user
        const token = jwt.sign({ _id: adminUser._id }, process.env.JWT_SECRET)

        res.cookie('AUTH', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })

        return { token, user: adminUser }
      }

      // Read users from the file
      let users = await this.readFile()

      // Find the user by email
      const user = users.find(user => user.email === email)
      if (!user) {
        throw new Error('No user found with this email')
      }

      // Check the password
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }

      // Generate a JWT token for the user
      const token = jwt.sign(
        { _id: user._id, cartId: user.cartId },
        process.env.JWT_SECRET
      )

      res.cookie('AUTH', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })

      return { token, user }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getUserById(userId) {
    const users = await this.readFile()
    console.log('getUserById userId:', userId)
    console.log('getUserById users:', users)
    const user = users.find(user => user._id == userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async getCartByUserId(userId) {
    const user = await this.getUserById(userId)
    return user.cartId
  }
}

export default UserDaoFS
