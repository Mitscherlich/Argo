const { resolve } = require('path')
const { createWriteStream } = require('fs')
const { createLogTail } = require('../utils/tail')

const r = (...path) => resolve(__dirname, ...path)

const logPath = r('../../logs/proxy.log')
const logWritable = createWriteStream(logPath, { flags: 'a+' })

function stream(req, res) {
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

module.exports = {
  logPath,
  logWritable,
  stream,
}
