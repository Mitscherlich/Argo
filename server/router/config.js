const { resolve } = require('path')
const { createStorage } = require('unstorage')

const r = (...path) => resolve(__dirname, ...path)

const storage = createStorage({
  driver: require('unstorage/drivers/fs-lite')({
    base: r(__dirname, '../../data'),
  }),
})

async function get(req, res) {
  const data = await storage.getItem('config.json') ?? {}
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data))
  res.end()
}

async function save(req, res) {
  await storage.setItem('config.json', req.body)
  res.send('ok')
  res.end()
}

module.exports = {
  storage,
  save,
  get,
}
