const { format } = require('util')
const { createProxyMiddleware, loggerPlugin } = require('http-proxy-middleware')
const { Router } = require('express')

const { storage } = require('./config')
const { logWritable } = require('./log')

const fsLogger = {
  info: (input, ...data) => {
    logWritable.write(`${format(input, ...data)}\n`)
  },
  warn: (input, ...data) => {
    logWritable.write(`${format(input, ...data)}\n`)
  },
  error: (input, ...data) => {
    logWritable.write(`${format(input, ...data)}\n`)
  },
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').OutgoingMessage} res
 * @param {Function} next
 */
async function proxyRequest(req, res, next) {
  const config = await storage.getItem('config.json') ?? {}
  const router = Router()
  Object.keys(config).forEach((path) => {
    router.all(path, createProxyMiddleware({
      ...(typeof config[path] === 'string' ? { target: config[path] } : config[path]),
      logger: fsLogger,
      plugins: [loggerPlugin],
      on: {
        proxyReq: (proxyReq) => {
          // TODO
        },
        proxyRes: (proxyRes) => {
          // TODO
        },
      },
    }))
  }, [])

  req.url = req.headers['x-request-path'] ?? req.url.replace(/^\/proxy/, '')

  router(req, res, next)
}

module.exports = {
  proxyRequest,
}
