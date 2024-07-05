import { resolve } from 'node:path'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import consola from 'consola'
import loadConfig from './config'
import { upon } from './utils/process'

const r = (...path: string[]) => resolve(__dirname, ...path)

const isProd = process.env.NODE_ENV === 'production'

async function createServer() {
  const config = await loadConfig()
  const app = express()

  if (isProd) {
    app.use(morgan('common'))
    app.use(express.static(r('../dist')))
  }
  else {
    app.use(morgan('dev'))
  }

  app.use(cors())
  app.use(bodyParser.json())

  await import('./router').then(router => router.register(app))

  const { host, port } = config.app

  const server = app.listen(port, host, () => {
    consola.ready({
      message: `server running at http://${host}:${port}`,
      badge: true,
    })
  })

  server.on('close', () => {
    consola.warn({
      message: 'server closed!',
      badge: true,
    })
  })

  return server
}

const serverPromise = createServer()

upon('SIGTERM SIGINT')
  .then((signal) => {
    consola.warn(`${signal} signal received: closing server`)
    return serverPromise
  }).then((server) => {
    server.close()
  })
