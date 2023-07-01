import { Schema, model } from 'mongoose'
import { createHash } from '../../../utils/crypto.js'

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  username: { type: String, required: true },
  cartId: { type: Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  user.password = await createHash(user.password)
  next()
})

// Verify password
userSchema.methods.verifyPassword = async function (password) {
  return isValidPassword(password, this.password)
}

const userModel = model('users', userSchema)

export default userModel
