export interface UserRow {
  id: number
  name: string
  status: 'active' | 'inactive'
  region: 'na' | 'eu' | 'apac'
  signedUpAt: string
}

export const sampleUsers: UserRow[] = [
  { id: 1, name: 'Ada', status: 'active', region: 'na', signedUpAt: '2026-03-18' },
  { id: 2, name: 'Ben', status: 'inactive', region: 'eu', signedUpAt: '2026-03-10' },
  { id: 3, name: 'Cleo', status: 'active', region: 'na', signedUpAt: '2026-03-21' },
  { id: 4, name: 'Drew', status: 'active', region: 'apac', signedUpAt: '2026-03-04' },
  { id: 5, name: 'Elle', status: 'inactive', region: 'eu', signedUpAt: '2026-03-19' },
  { id: 6, name: 'Finn', status: 'active', region: 'eu', signedUpAt: '2026-03-22' }
]
