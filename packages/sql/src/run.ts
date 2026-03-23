import { sampleUsers } from './dataset.js'
import { executeReadOnlyQuery } from './execute.js'
import { generateSql } from './generate.js'
import { schemaContext } from './schema.js'
import { validateSql } from './validate.js'
import type { QueryResponse } from './types.js'

export function runReadOnlyQuestion(question: string): QueryResponse {
  const generated = generateSql(question)
  const warnings = validateSql(generated.sql)

  if (warnings.length > 0) {
    return {
      question,
      sql: generated.sql,
      intent: generated.intent,
      warnings,
      columns: ['error'],
      rows: [{ error: 'Generated SQL failed validation.' }]
    }
  }

  const result = executeReadOnlyQuery(generated.sql, sampleUsers)

  return {
    question,
    sql: generated.sql,
    intent: generated.intent,
    warnings: [`Schema context used: ${schemaContext.split('\n')[0]}`],
    columns: result.columns,
    rows: result.rows
  }
}
