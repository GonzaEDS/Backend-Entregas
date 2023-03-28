// import { Router } from 'express'
// import ChatManager from '../../dao/chat.manager.js'

// const router = Router()

// // GET route to retrieve all messages
// router.get('/', async (req, res) => {
//   try {
//     const messages = await ChatManager.getAllMessages()
//     res.json(messages)
//   } catch (error) {
//     console.error(error.message)
//     res.status(500).send('Server error')
//   }
// })

// // POST route to add a new message
// router.post('/', async (req, res) => {
//   try {
//     const { user, message } = req.body
//     const newMessage = await ChatManager.saveMessage(user, message)
//     res.json(newMessage)
//   } catch (error) {
//     console.error(error.message)
//     res.status(500).send('Server error')
//   }
// })

// export default router

import { Router } from 'express'
import ChatManager from '../../dao/chat.manager.js'
import { socketExport } from '../../../socket/configureSocket.js'

const router = Router()

// GET route to retrieve all messages
router.get('/', async (req, res) => {
  try {
    const messages = await ChatManager.getAllMessages()
    res.json(messages)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// POST route to add a new message
router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body
    const newMessage = await ChatManager.saveMessage(user, message)
    socketExport.emit('NEW_MESSAGE_SERVER', newMessage)
    socketExport.broadcast.emit('NEW_MESSAGE_SERVER', newMessage)
    res.json(newMessage)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

export default router
