import { resolve } from 'node:path'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import consola from 'consola'
import loadConfig from './config'

const r = (...path: string[]) => resolve(__dirname, ...path)

const isProd = process.env.NODE_ENV === 'production'

;(async () => {
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

  app.listen(port, host, () => {
    consola.success({
      message: `server running at http://${host}:${port}`,
      badge: true,
    })
  })
})()
