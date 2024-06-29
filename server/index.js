const path = require('path')
const express = require('express')
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

  app.use(bodyParser.json())

  require('./router')(app)

  const server = app.listen(port, host, () => {
    consola.success({
      message: `server running at http://${host}:${port}`,
      badge: true,
    })
  })
}

start()
