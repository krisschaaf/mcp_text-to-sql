import { describe, expect, it } from 'vitest'

import { generateSql, runReadOnlyQuestion, validateSql } from './index.js'

describe('generateSql', () => {
  it('creates a count query for active users', () => {
    expect(generateSql('How many active users are there?').sql).toContain("status = 'active'")
  })
})

describe('validateSql', () => {
  it('blocks mutating SQL', () => {
    expect(validateSql('DELETE FROM users')).toHaveLength(3)
  })
})

describe('runReadOnlyQuestion', () => {
  it('returns a read-only result for a count question', () => {
    const response = runReadOnlyQuestion('How many active users do we have?')

    expect(response.sql).toContain("status = 'active'")
    expect(response.columns).toEqual(['count'])
    expect(response.rows[0]).toMatchObject({ count: 4 })
  })
})
