import { describe, expect, it } from 'vitest'

import { schemaMetadata } from './schema.js'

describe('schemaMetadata', () => {
  it('describes the users table', () => {
    expect(schemaMetadata.tables[0]?.name).toBe('users')
    expect(schemaMetadata.notes).toContain('Use read-only SELECT queries only.')
  })
})
