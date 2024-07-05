import { resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import type { Request, Response } from 'express'
import { createLogTail } from '../utils/tail'

const r = (...path: string[]) => resolve(__dirname, ...path)

export const logPath = r('../../logs/proxy.log')
export const logWritable = createWriteStream(logPath, { flags: 'a+' })

export function stream(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const tail = createLogTail(logPath)

  tail.on('data', (chunk) => {
    res.write(chunk)
  })
  tail.on('error', (err) => {
    res.status(500).send(err)
    res.end()
  })

  req.on('close', () => {
    tail.close()
  })
}
