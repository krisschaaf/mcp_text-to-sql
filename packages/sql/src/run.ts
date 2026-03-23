import { sampleUsers } from './dataset.js'
import { executeReadOnlyQuery } from './execute.js'
import { planReadOnlyQuestion } from './plan.js'
import { schemaContext } from './schema.js'
import type { QueryResponse } from './types.js'

export function runReadOnlyQuestion(question: string): QueryResponse {
  const plan = planReadOnlyQuestion(question)

  if (plan.warnings.length > 0) {
    return {
      question,
      sql: plan.sql,
      intent: plan.intent,
      warnings: plan.warnings,
      columns: ['error'],
      rows: [{ error: 'Generated SQL failed validation.' }],
      source: 'fallback'
    }
  }

  const result = executeReadOnlyQuery(plan.sql, sampleUsers)

  return {
    question,
    sql: plan.sql,
    intent: plan.intent,
    warnings: [`Schema context used: ${schemaContext.split('\n')[0]}`],
    columns: result.columns,
    rows: result.rows,
    source: 'fallback'
  }
}
