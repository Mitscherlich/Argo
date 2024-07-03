const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const consola = require('consola')

const r = (...args) => path.resolve(__dirname, ...args)

const app = express()

const isProd = process.env.NODE_ENV === 'production'

async function start() {
  const config = await require('./config')

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

  const { host, port } = config.app
  app.listen(port, host, () => {
    consola.success({
      message: `server running at http://${host}:${port}`,
      badge: true,
    })
  })
}

start()
