import { EventEmitter } from 'node:events'
import type { FSWatcher, ReadStream } from 'node:fs'
import { createReadStream, stat, watch } from 'node:fs'
import { ensureFileSync } from 'fs-extra'

class Tail extends EventEmitter {
  #path: string
  #options: any
  #stream?: ReadStream
  #fileSize = 0
  #fsWacher: FSWatcher | null = null

  static #fsWatcherMap = new Map()

  constructor(path, options) {
    super()
    this.#path = path
    this.#options = Object.assign({
      // TODO
    }, options)
  }

  #initReadStream(start) {
    this.#stream?.close()
    this.#stream = createReadStream(this.#path, {
      encoding: 'utf-8',
      start,
    })

    this.#stream!.on('data', (chunk) => {
      this.emit('data', chunk)
    })
    this.#stream!.on('end', () => {
      this.emit('end')
    })
    this.#stream!.on('error', (err) => {
      this.emit('error', err)
    })
  }

  #retrieve() {
    stat(this.#path, (err, stats) => {
      if (err) {
        this.emit('error', err)
        return
      }
      if (stats.size > this.#fileSize) {
        this.#initReadStream(this.#fileSize)
        this.#fileSize = stats.size
      }
    })
  }

  #initFsWatcher() {
    if (!Tail.#fsWatcherMap.has(this.#path)) {
      this.#fsWacher = watch(this.#path, (eventType) => {
        if (eventType === 'change')
          this.#retrieve()
      })
      Tail.#fsWatcherMap.set(this.#path, this.#fsWacher)
    }
  }

  start() {
    ensureFileSync(this.#path)
    this.#initFsWatcher()
    this.#retrieve()
    return this
  }

  close() {
    this.#stream?.close()
    return this
  }
}

export function createLogTail(path, options = {}) {
  return new Tail(path, options).start()
}
