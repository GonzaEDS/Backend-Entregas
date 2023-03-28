import express from 'express'
import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import router from './src/routes/index.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'

const app = express()
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas')
  })
  .catch(error => {
    console.error(error)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/src/views')
app.set('view engine', 'handlebars')

// app.get('/test', async (req, res) => {
//   res.render('index', response)
// })

app.use(express.static(__dirname + '/public'))

app.use('/', router)

export default app
