import { generateSql, runReadOnlyQuestion, schemaContext, validateSql } from '@mcp-text-to-sql/sql'

import { executeSql } from './db.js'

async function executePlannedSql(question: string, sql: string) {
  try {
    return { result: await executeSql(sql), source: 'postgres' as const }
  } catch {
    return { result: runReadOnlyQuestion(question), source: 'fallback' as const }
  }
}

export async function buildQueryResponse(question: string) {
  const generated = generateSql(question)
  const plan = {
    ...generated,
    warnings: validateSql(generated.sql)
  }

  if (plan.warnings.length > 0) {
    return { ...runReadOnlyQuestion(question), source: 'fallback' }
  }

  const { result, source } = await executePlannedSql(question, plan.sql)

  return {
    question,
    sql: plan.sql,
    intent: plan.intent,
    warnings: [`Schema context used: ${schemaContext.split('\n')[0]}`],
    columns: result.columns,
    rows: result.rows,
    source
  }
}
