const config = require('./router/config')
const log = require('./router/log')
const proxy = require('./router/proxy')

/** @param {import('express').Application} app */
module.exports = (app) => {
  /** config routes */
  app.post('/config/save', config.save)
  app.get('/config/get', config.get)

  /** proxy routes */
  app.all('/proxy/*', proxy.proxyRequest)

  /** log routes */
  app.get('/log/stream', log.stream)
}
