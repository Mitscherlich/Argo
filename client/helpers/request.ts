import axios from 'axios'

const SSE = axios.create({
  headers: {
    Accept: 'text/event-stream',
  },
  responseType: 'stream',
  adapter: 'fetch',
})

const axiosJson = axios.create({
  headers: {
    Accept: 'application/json',
  },
})

export { axiosJson, SSE }
