import { Server } from 'socket.io'
//import products from '../src/dao/mongo/chat.manager.js'
import { v4 as uuidv4 } from 'uuid'
import axios from '../src/config/axios.instance.js'
import DaoFactory from '../src/dao/daoFactory.js'
const products = await DaoFactory.getDao('product')

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
      console.log('on NEW_PRODUCT_CLI')
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
        console.log('products:', products)
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
        console.log(data)
        console.log('prodId', prodId, 'quntity', quantity)

        const headers = {
          Cookie: socket.request.headers.cookie
        }

        await axios.put(
          `/api/carts/products/${prodId}`,
          { quantity },
          { headers }
        )
      } catch (error) {
        console.error('configureSocket 57', error.message)
      }
    })
    socket.on('FILTER_APLIED_CLI', async params => {
      try {
        const response = await axios.get('/api/products', { params })
        const data = response.data.payload

        const { docs, ...paginationOptions } = data

        const prods = data.docs

        io.emit('SERVER_PRODUCTS', { prods: docs, paginationOptions })
      } catch (error) {
        console.error('configureSocket FILTER_APLIED', error.message)
      }
    })
  })
}
