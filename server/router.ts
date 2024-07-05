import type { Application } from 'express'
import * as config from './router/config'
import * as log from './router/log'
import * as proxy from './router/proxy'

export function register(app: Application) {
  /** config routes */
  app.post('/config/save', config.save)
  app.get('/config/get', config.get)

  /** proxy routes */
  app.all('/proxy/*', proxy.proxyRequest)

  /** log routes */
  app.get('/log/stream', log.stream)
}
