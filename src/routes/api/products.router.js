import { Router } from 'express'
import { connections, socketExport } from '../../../socket/configureSocket.js'
const router = Router()
// import products from '../../controllers/ProductManager.js'
import products from '../../dao/product.manager.js'

// // Listen for a new product being added to the database
// app.post('/products', (req, res) => {
//   const newProduct = req.body;
//   // Save the new product to the database
//   // ...

//   // Emit a message to all connected clients, notifying them that a new product has been added
//   io.emit('newProduct', newProduct);

//   res.redirect('/');
// });

// La ruta raíz POST / deberá agregar un nuevo producto con los campos...
router.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, stock } = req.body
    let data = await products.saveProduct(
      title,
      description,
      price,
      thumbnail,
      stock
    )
    // const socket = connections.find(c => c.credential == 'lo que sea')
    console.log('inside Post')
    // const socket = connections
    // console.log(socket)
    const socket = socketExport
    socket.emit('NEW_PRODUCT_SERVER', data)
    // console.log(socket)
    // socket.emit('TEST', { test: 'ok', success: 'true' })
    res.status(200).json({
      response: data
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})
// La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body...
router.put('/:pid', async (req, res) => {
  let { pid } = req.params
  if (Object.keys(req.body)[0] == 'id') {
    res.status(403).json({
      response: 'Can not modify the id of a product'
    })
  }
  try {
    let data = await products.putById(pid, req.body)

    if (data) {
      res.status(200).json({
        response: data
      })
    } else {
      res.status(404).json({
        respones: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})
// La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.
router.delete('/:pid', async (req, res) => {
  let { pid } = req.params
  try {
    let data = await products.deleteById(pid)
    if (data) {
      res.status(200).json({
        response: 'product deleted'
      })
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/', async (_req, res) => {
  try {
    let data = await products.getAll()
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/:pid', async (req, res) => {
  let { pid } = req.params
  try {
    let data = []
    data.push(await products.getById(pid))
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

export default router
