import { describe, expect, it } from 'vitest'

import { planReadOnlyQuestion } from './plan.js'

describe('planReadOnlyQuestion', () => {
  it('returns validation warnings for unsafe SQL', () => {
    const plan = planReadOnlyQuestion('count users')

    expect(plan.sql).toContain('LIMIT 100')
    expect(plan.warnings).toEqual([])
  })
})
