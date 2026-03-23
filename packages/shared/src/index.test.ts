import { describe, expect, it } from 'vitest'

import { normalizeQuestion } from './index'

describe('normalizeQuestion', () => {
  it('collapses whitespace', () => {
    expect(normalizeQuestion('  how   many   users?  ')).toBe('how many users?')
  })
})
