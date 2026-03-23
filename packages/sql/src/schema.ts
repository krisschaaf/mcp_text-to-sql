export const schemaContext = `
tables:
  users(id, name, status, region, signed_up_at)

notes:
  - status is one of active or inactive
  - region is one of na, eu, or apac
  - signed_up_at is stored as an ISO date string
  - read-only SELECT queries only
`.trim()
