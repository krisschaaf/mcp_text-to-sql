declare module 'pg' {
  export interface QueryField {
    name: string
  }

  export interface QueryResult<Row = Record<string, unknown>> {
    fields: QueryField[]
    rows: Row[]
  }

  export interface PoolConfig {
    connectionString?: string
    max?: number
    ssl?: boolean | { rejectUnauthorized: boolean }
  }

  export class Pool {
    constructor(config?: PoolConfig)
    query<Row = Record<string, unknown>>(sql: string): Promise<QueryResult<Row>>
    end(): Promise<void>
  }
}
