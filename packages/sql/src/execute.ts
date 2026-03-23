import type { UserRow } from './dataset.js'
import type { QueryResult, QueryResultRow } from './types.js'

function toResultRow(row: QueryResultRow): QueryResultRow {
  return row
}

export function executeReadOnlyQuery(sql: string, users: UserRow[]): QueryResult {
  if (/count\(\*\) as count from users where status = 'active'/i.test(sql)) {
    return {
      columns: ['count'],
      rows: [toResultRow({ count: users.filter((user) => user.status === 'active').length })]
    }
  }

  if (/select region, count\(\*\) as count from users group by region/i.test(sql)) {
    const counts = new Map<string, number>()

    for (const user of users) {
      counts.set(user.region, (counts.get(user.region) ?? 0) + 1)
    }

    return {
      columns: ['region', 'count'],
      rows: Array.from(counts.entries())
        .sort((left, right) => right[1] - left[1])
        .map(([region, count]) => toResultRow({ region, count }))
    }
  }

  if (/signed_up_at >= '2026-03-15'/i.test(sql)) {
    const cutoff = new Date('2026-03-15T00:00:00.000Z')
    const count = users.filter((user) => new Date(`${user.signedUpAt}T00:00:00.000Z`) >= cutoff).length

    return {
      columns: ['count'],
      rows: [toResultRow({ count })]
    }
  }

  return {
    columns: ['id', 'name', 'status', 'region', 'signed_up_at'],
    rows: users.map((user) =>
      toResultRow({
        id: user.id,
        name: user.name,
        status: user.status,
        region: user.region,
        signed_up_at: user.signedUpAt
      })
    )
  }
}
