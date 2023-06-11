import { Server } from 'socket.io'
//import products from '../src/dao/mongo/chat.manager.js'
import { v4 as uuidv4 } from 'uuid'
import axios from '../src/config/axios.instance.js'
import DaoFactory from '../src/dao/daoFactory.js'
const products = await DaoFactory.getDao('product')
import Logger from '../src/logger/winston-logger.js'

const uuid = uuidv4()
export const connections = []
export let socketExport = undefined
export default function configureSocket(httpServer) {
  const io = new Server(httpServer)

  io.on('connection', socket => {
    Logger.debug('New client connected')
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
        Logger.error(error.message)
      }
    })
    socket.on('PROD_TO_CART_CLI', async code => {
      try {
        Logger.debug('products:', products)
        const pid = await products.findProductByCode(code)
        io.emit('PROD_TO_CART_SERVER', pid)
      } catch (error) {
        Logger.isErrorEnabled('PROD_TO_CART', error.message)
      }
    })

    socket.on('chat', async messageData => {
      await axios.post('/api/chat', messageData)
    })
    socket.on('UPDATE_QUANTITY_SERVER', async data => {
      try {
        const { prodId, quantity } = data
        Logger.debug(data)
        Logger.debug('prodId', prodId, 'quntity', quantity)

        const headers = {
          Cookie: socket.request.headers.cookie
        }

        await axios.put(
          `/api/carts/products/${prodId}`,
          { quantity },
          { headers }
        )
      } catch (error) {
        Logger.error('configureSocket 57', error.message)
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
        Logger.error('configureSocket FILTER_APLIED', error.message)
      }
    })
  })
}
