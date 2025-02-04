import { resolve } from 'node:path'
import { loadConfig } from 'unconfig'

const r = (...path: string[]) => resolve(__dirname, ...path)

const envMap = {
  development: 'dev',
  production: 'prod',
  test: 'test',
}
const nodeEnv = process.env.NODE_ENV || 'development'
const env = envMap[nodeEnv] || envMap.development

const host = process.env.HOST || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000')

export default async () => {
  const { config } = await loadConfig({
    cwd: r('../config'),
    sources: [
      { files: ['config'] },
      { files: [`config.${env}`] },
    ],
    merge: true,
    defaults: {
      app: { host, port },
    },
  })

  return config
}
