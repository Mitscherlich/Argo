import { resolve } from 'node:path'
import type { Request, Response } from 'express'
import { createStorage } from 'unstorage'
import createFsLiteDriver from 'unstorage/drivers/fs-lite'

const r = (...path: string[]) => resolve(__dirname, ...path)

export const storage = createStorage({
  driver: createFsLiteDriver({
    base: r(__dirname, '../../data'),
  }),
})

export async function get(req: Request, res: Response) {
  const data = await storage.getItem('config.json') ?? {}
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data))
  res.end()
}

export async function save(req: Request, res: Response) {
  await storage.setItem('config.json', req.body)
  res.send('ok')
  res.end()
}
