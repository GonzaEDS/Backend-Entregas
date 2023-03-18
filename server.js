import app from './app.js'
import configureSocket from './socket/configureSocket.js'
import { v4 as uuidv4 } from 'uuid'

const uuid = uuidv4()

const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, () =>
  console.info(`Server up and running in port ${PORT}`)
)

configureSocket(httpServer)
