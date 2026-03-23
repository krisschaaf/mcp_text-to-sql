import { Pool } from 'pg'

import type { QueryResult, QueryResultRow } from '@mcp-text-to-sql/sql'

import { env } from './env.js'

let pool: Pool | null = null

function getDatabaseUrl(): string | null {
  return env.databaseUrl
}

export function getPool(): Pool | null {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    return null
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: 4,
      ssl: env.pgSslMode === 'require' ? { rejectUnauthorized: false } : undefined
    })
  }

  return pool
}

export async function executeSql(sql: string): Promise<QueryResult> {
  const activePool = getPool()

  if (!activePool) {
    throw new Error('DATABASE_URL is not configured.')
  }

  const result = await activePool.query(sql)
  const columnNames = result.fields.map((field) => field.name)

  return {
    columns: columnNames,
    rows: result.rows.map((row) => {
      const normalizedRow: QueryResultRow = {}

      for (const columnName of columnNames) {
        const value = row[columnName]

        if (typeof value === 'string' && /^-?\d+$/.test(value)) {
          normalizedRow[columnName] = Number(value)
          continue
        }

        normalizedRow[columnName] = value as QueryResultRow[string]
      }

      return normalizedRow
    })
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
