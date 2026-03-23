import { afterEach, describe, expect, it } from 'vitest'

import { createAppServer } from './http.js'

const servers: Array<{ close: () => Promise<void> }> = []

afterEach(async () => {
  while (servers.length > 0) {
    const server = servers.pop()
    if (server) {
      await server.close()
    }
  }
})

async function startServer() {
  const server = createAppServer()
  await new Promise<void>((resolve) => {
    server.listen(0, resolve)
  })

  const address = server.address()
  if (typeof address !== 'object' || address === null) {
    throw new Error('Failed to start server')
  }

  servers.push({ close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))) })

  return {
    baseUrl: `http://127.0.0.1:${address.port}`
  }
}

describe('HTTP server', () => {
  it('returns schema metadata', async () => {
    const { baseUrl } = await startServer()
    const response = await fetch(`${baseUrl}/schema`)
    const body = (await response.json()) as { tables: Array<{ name: string }> }

    expect(response.ok).toBe(true)
    expect(body.tables[0]?.name).toBe('users')
  })
})
