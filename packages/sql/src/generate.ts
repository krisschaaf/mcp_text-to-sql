import { normalizeQuestion } from './normalize.js'
import type { GeneratedSql } from './types.js'

export function generateSql(question: string): GeneratedSql {
  const normalized = normalizeQuestion(question).toLowerCase()

  if (normalized.includes('active') && (normalized.includes('how many') || normalized.includes('count'))) {
    return {
      intent: 'active-user-count',
      sql: "SELECT COUNT(*) AS count FROM users WHERE status = 'active' LIMIT 100"
    }
  }

  if (normalized.includes('region') && (normalized.includes('how many') || normalized.includes('count'))) {
    return {
      intent: 'users-by-region',
      sql: 'SELECT region, COUNT(*) AS count FROM users GROUP BY region ORDER BY count DESC LIMIT 100'
    }
  }

  if (normalized.includes('sign up') || normalized.includes('signup') || normalized.includes('signed up')) {
    return {
      intent: 'recent-signups',
      sql: "SELECT COUNT(*) AS count FROM users WHERE signed_up_at >= '2026-03-15' LIMIT 100"
    }
  }

  return {
    intent: 'sample-users',
    sql: 'SELECT id, name, status, region, signed_up_at FROM users ORDER BY signed_up_at DESC LIMIT 100'
  }
}
