import { describe, expect, it } from 'vitest'

import { buildQueryResponse } from './query.js'

describe('MCP query integration', () => {
  it('returns query metadata for the MCP tool', async () => {
    const response = await buildQueryResponse('How many active users are there?')

    expect(response.sql).toContain("status = 'active'")
    expect(response.source).toBeDefined()
  })
})
