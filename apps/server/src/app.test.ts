import { describe, expect, it } from 'vitest'

import { buildQueryResponse } from './query.js'
import { parseJsonBody } from './app.js'

describe('parseJsonBody', () => {
  it('parses a question payload', () => {
    expect(parseJsonBody('{"question":"How many active users?"}')).toEqual({
      question: 'How many active users?'
    })
  })
})

describe('buildQueryResponse', () => {
  it('returns a read-only SQL result', async () => {
    const response = await buildQueryResponse('How many active users are there?')

    expect(response.sql).toContain("status = 'active'")
    expect(response.rows[0]).toMatchObject({ count: 4 })
  })
})
