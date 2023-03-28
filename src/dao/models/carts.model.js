import { Schema, model } from 'mongoose'

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ]
})

const cartModel = model('carts', cartSchema)

export default cartModel
