import winston from 'winston'

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5
}

const colors = {
  fatal: 'red',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'white'
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple()
    ),
    level: process.env.ENVIRONMENT === 'production' ? 'info' : 'debug'
  }),
  new winston.transports.File({
    filename: './log/errors.log',
    level: 'error'
  })
]

const Logger = winston.createLogger({
  levels,
  format,
  transports
})

export default Logger
