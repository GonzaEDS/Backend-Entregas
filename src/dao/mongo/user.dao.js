import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from '../../config/axios.instance.js'
import userModel from './models/users.model.js'
import crypto from 'crypto'
import Mailer from '../../config/mailer.js'
class UserDao {
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
      const token = jwt.sign(
        { _id: newUser._id, cartId: newUser.cartId, role: newUser.role },
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
          { _id: adminUser._id, role: adminUser.role },
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
        { _id: user._id, cartId: user.cartId, role: user.role },
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
  async requestPasswordReset(email) {
    const user = await userModel.findOne({ email })
    if (!user) {
      throw new Error('No user found with that email address.')
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Set the reset token and expiry time on the user's record
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now

    await user.save()

    // Send the password reset email
    const resetURL = `http://${process.env.HOST}:${process.env.PORT}/reset/${resetToken}`
    const subject = 'Password Reset Request'
    const title = 'Password Reset Request'
    const content = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
        ${resetURL}
        If you did not request this, please ignore this email and your password will remain unchanged.`

    Mailer.sendMail(email, subject, title, content)
  }
  async getUserByToken(token) {
    try {
      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      })

      return user ? user.toObject() : null
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async resetPassword(token, newPassword) {
    // Get the user associated with the reset token
    const user = await this.getUserByToken(token)

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.')
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password and clear the password reset token and expiry time
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      },
      { new: true }
    )

    return updatedUser ? updatedUser.toObject() : null
  }
}

export default UserDao
