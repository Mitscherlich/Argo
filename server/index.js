const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const consola = require('consola')

const r = (...args) => path.resolve(__dirname, ...args)

const app = express()

const isProd = process.env.NODE_ENV === 'production'
const host = process.env.HOST || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000')

async function start() {
  if (isProd) {
    app.use(morgan('common'))
    app.use(express.static(r('./public')))
  }
  else {
    app.use(morgan('dev'))
  }

  app.use(cors())
  app.use(bodyParser.json())

  require('./router')(app)

  app.listen(port, host, () => {
    consola.success({
      message: `server running at http://${host}:${port}`,
      badge: true,
    })
  })
}

start()
