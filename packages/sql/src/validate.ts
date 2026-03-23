const forbiddenPatterns = [
  /;/,
  /--/,
  /\/\*/,
  /\b(insert|update|delete|drop|alter|create|replace|truncate|grant|revoke|attach|detach|pragma|vacuum)\b/i,
  /\b(begin|commit|rollback|savepoint)\b/i
]

export function validateSql(sql: string): string[] {
  const issues: string[] = []
  const normalized = sql.trim()

  if (!/^(select|with)\b/i.test(normalized)) {
    issues.push('Only SELECT or WITH queries are allowed.')
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(normalized)) {
      issues.push(`Disallowed SQL pattern: ${pattern}`)
    }
  }

  if (!/\blimit\b/i.test(normalized)) {
    issues.push('A LIMIT clause is required.')
  }

  return issues
}
