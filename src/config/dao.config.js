import dotenv from 'dotenv'
dotenv.config()

const config = {
  persistence: process.env.PERSISTENCE,
  MONGODB_URI: process.env.MONGODB_URI
}

export default config
