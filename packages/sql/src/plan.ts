import { generateSql } from './generate.js'
import { validateSql } from './validate.js'
import type { GeneratedSql } from './types.js'

export interface QueryPlan extends GeneratedSql {
  warnings: string[]
}

export function planReadOnlyQuestion(question: string): QueryPlan {
  const generated = generateSql(question)
  const warnings = validateSql(generated.sql)

  return {
    ...generated,
    warnings
  }
}
