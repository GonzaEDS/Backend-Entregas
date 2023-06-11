import express from 'express'
import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import router from './src/routes/index.js'
import customResponseMiddleware from './src/middlewares/custom-response.middleare.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { configurePassport } from './src/config/passport.config.js'
import { configureHandlebars } from './src/config/handlebars.config.js'
import roleMiddleware from './src/middlewares/roleRenderMiddleware.js'
import { loggerMiddleware } from './src/logger/logger.middleware.js'
const app = express()
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(roleMiddleware)
app.use(customResponseMiddleware)

configurePassport()
app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(loggerMiddleware)

const hbs = configureHandlebars()
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/src/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use('/', router)

export default app
