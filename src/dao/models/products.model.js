import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  code: { type: String, required: true }
})

const productModel = mongoose.model('products', productSchema)

export default productModel
