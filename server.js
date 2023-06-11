import app from './app.js'
import configureSocket from './socket/configureSocket.js'
import { v4 as uuidv4 } from 'uuid'
import Logger from './src/logger/winston-logger.js'

const uuid = uuidv4()

const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, () =>
  Logger.info(`Server up and running in port ${PORT}`)
)

configureSocket(httpServer)
