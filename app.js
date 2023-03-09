import express from 'express'
import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import router from './src/routes/index.js'
import handlebars from 'express-handlebars'

const app = express()
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))

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
