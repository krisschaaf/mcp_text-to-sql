export interface SchemaColumn {
  name: string
  type: string
  description: string
}

export interface SchemaTable {
  name: string
  description: string
  columns: SchemaColumn[]
}

export interface SchemaMetadata {
  tables: SchemaTable[]
  notes: string[]
}

export const schemaMetadata: SchemaMetadata = {
  tables: [
    {
      name: 'users',
      description: 'Primary sample table for read-only analytics.',
      columns: [
        { name: 'id', type: 'integer', description: 'Primary key.' },
        { name: 'name', type: 'text', description: 'User display name.' },
        { name: 'status', type: 'text', description: 'active or inactive.' },
        { name: 'region', type: 'text', description: 'na, eu, or apac.' },
        { name: 'signed_up_at', type: 'date', description: 'Signup date in ISO format.' }
      ]
    }
  ],
  notes: [
    'Use read-only SELECT queries only.',
    'status is one of active or inactive.',
    'region is one of na, eu, or apac.',
    'signed_up_at is stored as an ISO date string.'
  ]
}

export const schemaContext = `
tables:
  users(id, name, status, region, signed_up_at)

notes:
  - status is one of active or inactive
  - region is one of na, eu, or apac
  - signed_up_at is stored as an ISO date string
  - read-only SELECT queries only
`.trim()
