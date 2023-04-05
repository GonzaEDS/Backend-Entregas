import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  cartId: { type: Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
})

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)
  user.password = hash
  next()
})

// Verify password
userSchema.methods.verifyPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

const userModel = model('users', userSchema)

export default userModel
