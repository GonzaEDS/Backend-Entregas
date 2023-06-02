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
const app = express()
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))

// mongoose
//   .connect(process.env.MONGODB_URI || 'mongodb://localhost/ecommerce', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas')
//   })
//   .catch(error => {
//     console.error(error)
//   })

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(roleMiddleware)
app.use(customResponseMiddleware)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60 // session TTL in seconds
    })
  })
)
configurePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const hbs = configureHandlebars()
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/src/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use('/', router)

export default app
