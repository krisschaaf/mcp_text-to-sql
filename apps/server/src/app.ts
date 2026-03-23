import type { IncomingMessage, ServerResponse } from 'node:http'

export interface QueryRequestBody {
  question?: string
}

function isQueryRequestBody(value: unknown): value is QueryRequestBody {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as QueryRequestBody
  return candidate.question === undefined || typeof candidate.question === 'string'
}

export function parseJsonBody(body: string): QueryRequestBody {
  const parsed = JSON.parse(body) as unknown

  if (!isQueryRequestBody(parsed)) {
    throw new Error('Request body must include a question string.')
  }

  return parsed
}

export function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.statusCode = statusCode
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload, null, 2))
}

export async function readRequestBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks).toString('utf8')
}
