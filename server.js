import app from './app.js'
import { Server } from 'socket.io'
import products from './src/controllers/ProductManager.js'
import { v4 as uuidv4 } from 'uuid'
const uuid = uuidv4()

const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, () =>
  console.info(`Server up and running in port ${PORT}`)
)
const io = new Server(httpServer)

io.on('connection', socket => {
  console.log('nuevo cliente conectado')
  socket.on('NEW_PRODUCT_CLI', async product => {
    const { title, description, price, thumbnail, stock } = product
    console.log(product)
    const newProduct = await products.saveProduct(
      title,
      description,
      price,
      thumbnail,
      uuid,
      stock
    )
    console.log(newProduct)

    io.sockets.emit('NEW_PRODUCT_SERVER', newProduct)
  })
  socket.on('DELET_CLI', async code => {
    const id = await products.findProductByCode(code)
    await products.deleteById(id)
  })
})
