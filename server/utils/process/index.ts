import { createControlledPromise } from '@m9ch/utils'

export function upon(events: string | string[]) {
  const promise = createControlledPromise<string>()

  if (typeof events === 'string')
    events = events.split(' ')

  events.forEach((event) => {
    process.on(event, () => {
      promise.resolve(event)
    })
  })

  return promise
}
