import { Server } from 'socket.io'
// import products from '../src/controllers/ProductManager.js'
import products from '../src/dao/product.manager.js'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import carts from '../src/dao/cart.manager.js'
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
      const pid = await products.findProductByCode(code)
      try {
        await axios.delete(`/api/products/${pid}`)
      } catch (error) {
        console.error(error.message)
      }
    })
    socket.on('PROD_TO_CART_CLI', async code => {
      try {
        const pid = await products.findProductByCode(code)
        io.emit('PROD_TO_CART_SERVER', pid)
      } catch (error) {
        console.log('PROD_TO_CART', error.message)
      }
    })
    socket.on('chat', async messageData => {
      await axios.post('/api/chat', messageData)
    })
    socket.on('UPDATE_QUANTITY_SERVER', async data => {
      try {
        const { prodId, quantity } = data
        console.log(prodId, quantity)

        const headers = {
          Cookie: socket.request.headers.cookie
        }

        await axios.put(
          `/api/carts/products/${prodId}`,
          { quantity },
          { headers }
        )
      } catch (error) {
        console.error(error.message)
      }
    })
    socket.on('FILTER_APLIED_CLI', async params => {
      try {
        const data = await axios.get('/api/products', { params })

        const prods = data.data.docs
        io.emit('SERVER_PRODUCTS', prods)
      } catch (error) {
        console.error('configureSocket FILTER_APLIED', error.message)
      }
    })
  })
}
