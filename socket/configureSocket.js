import { Server } from 'socket.io'
import products from '../src/controllers/ProductManager.js'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
const uuid = uuidv4()
export const connections = []
export let socketExport = undefined
export default function configureSocket(httpServer) {
  const io = new Server(httpServer)

  io.on('connection', socket => {
    console.log('nuevo cliente conectado')
    let credential = `socket-${socket.id}`
    connections.push({ socket, credential })
    socketExport = socket
    socket.on('NEW_PRODUCT_CLI', async product => {
      await axios.post('/api/products', product)
    })
    socket.on('DELET_CLI', async code => {
      const id = await products.findProductByCode(code)
      await products.deleteById(id)
    })
    socket.on('chat', async messageData => {
      // Broadcast the message data to all connected clients
      //   console.log('server receive chat', messageData)
      await axios.post('/api/chat', messageData)
      //   io.emit('chat', messageData)
      //   socket.emit('chat', messageData)
      //   socket.broadcast.emit('chat', messageData)
    })
  })
}
