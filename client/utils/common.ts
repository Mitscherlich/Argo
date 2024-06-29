import consola from 'consola'

export function safeJsonParse<T = unknown>(input: string, _default?: T) {
  try {
    return JSON.parse(input) as T
  }
  catch (e) {
    consola.warn('[safeJsonParse] parse error:', e)
    return _default as T
  }
}
