export interface GeneratedSql {
  sql: string
  intent: string
}

export interface QueryResultRow {
  [key: string]: string | number | boolean | null
}

export interface QueryResult {
  columns: string[]
  rows: QueryResultRow[]
}

export interface QueryResponse extends QueryResult {
  question: string
  sql: string
  intent: string
  warnings: string[]
  source?: 'postgres' | 'fallback'
}
