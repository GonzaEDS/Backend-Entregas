// dao/mongo/models/tickets.model.js
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
})

const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel