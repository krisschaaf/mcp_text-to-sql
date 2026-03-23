import { createServer } from 'node:http'

import { buildQueryResponse } from './query.js'
import { parseJsonBody, readRequestBody, sendJson } from './app.js'
import { env } from './env.js'

const port = env.port

export function createAppServer() {
  return createServer(async (request, response) => {
    response.setHeader('access-control-allow-origin', '*')
    response.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS')
    response.setHeader('access-control-allow-headers', 'content-type')

    if (request.method === 'OPTIONS') {
      response.statusCode = 204
      response.end()
      return
    }

    if (request.method === 'GET' && request.url === '/health') {
      sendJson(response, 200, { ok: true })
      return
    }

    if (request.method === 'POST' && request.url === '/query') {
      try {
        const body = parseJsonBody(await readRequestBody(request))
        const question = body.question?.trim() ?? ''

        if (!question) {
          sendJson(response, 400, { error: 'Question is required.' })
          return
        }

        sendJson(response, 200, await buildQueryResponse(question))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown request error.'
        sendJson(response, 400, { error: message })
      }

      return
    }

    sendJson(response, 404, { error: 'Not found' })
  })
}

export function startServer(): void {
  const server = createAppServer()

  server.listen(port, () => {
    console.log(`mcp_text-to-sql server listening on http://localhost:${port}`)
  })
}
