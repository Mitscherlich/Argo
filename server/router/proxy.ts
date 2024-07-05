import { format } from 'node:util'
import { createProxyMiddleware, loggerPlugin } from 'http-proxy-middleware'
import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'

import { storage } from './config'
import { logWritable } from './log'

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

export async function proxyRequest(req: Request, res: Response, next: NextFunction) {
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

  req.url = req.headers['x-request-path'] as string ?? req.url.replace(/^\/proxy/, '')

  router(req, res, next)
}
