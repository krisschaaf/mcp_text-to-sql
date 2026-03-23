import { useEffect, useState, type FormEvent } from 'react'

interface QueryResponse {
  question: string
  sql: string
  intent: string
  warnings: string[]
  columns: string[]
  rows: Array<Record<string, string | number | boolean | null>>
  source?: 'postgres' | 'fallback'
}

interface SchemaMetadata {
  tables: Array<{
    name: string
    description: string
    columns: Array<{ name: string; type: string; description: string }>
  }>
  notes: string[]
}

const apiBaseUrl = 'http://localhost:8787'

export function App() {
  const [question, setQuestion] = useState('How many active users do we have?')
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [schema, setSchema] = useState<SchemaMetadata | null>(null)
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [schemaLoading, setSchemaLoading] = useState(false)

  const rows = response?.rows ?? []

  useEffect(() => {
    async function loadSchema(): Promise<void> {
      setSchemaLoading(true)
      setSchemaError(null)

      try {
        const result = await fetch(`${apiBaseUrl}/schema`)

        if (!result.ok) {
          throw new Error('Failed to load schema metadata')
        }

        setSchema((await result.json()) as SchemaMetadata)
      } catch (loadError) {
        setSchema(null)
        setSchemaError(loadError instanceof Error ? loadError.message : 'Unknown schema error')
      } finally {
        setSchemaLoading(false)
      }
    }

    void loadSchema()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetch(`${apiBaseUrl}/query`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ question })
      })

      if (!result.ok) {
        const payload = (await result.json()) as { error?: string }
        throw new Error(payload.error ?? 'Request failed')
      }

      setResponse((await result.json()) as QueryResponse)
    } catch (submitError) {
      setResponse(null)
      setError(submitError instanceof Error ? submitError.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">mcp_text-to-sql</p>
        <h1>Chat to SQL, one safe slice at a time.</h1>
        <p className="lede">
          Ask a question, generate a read-only SQL statement, and inspect the result returned from
          the local server.
        </p>
      </section>

      <section className="panel chat-panel">
        <div>
          <p className="eyebrow">Schema</p>
          {schemaLoading ? (
            <p>Loading schema metadata...</p>
          ) : schemaError ? (
            <p className="error">{schemaError}</p>
          ) : schema ? (
            <div className="schema-card">
              {schema.tables.map((table) => (
                <div key={table.name} className="schema-table">
                  <p className="schema-table-name">{table.name}</p>
                  <p className="schema-table-description">{table.description}</p>
                  <ul>
                    {table.columns.map((column) => (
                      <li key={`${table.name}.${column.name}`}>
                        <strong>{column.name}</strong> <span>{column.type}</span> - {column.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <ul>
                {schema.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="query-form">
          <label htmlFor="question">Ask a question</label>
          <textarea
            id="question"
            rows={5}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="How many active users signed up last week?"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Working...' : 'Generate SQL'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {response ? (
          <div className="results">
            {response.source ? (
              <div>
                <p className="eyebrow">Source</p>
                <p>{response.source}</p>
              </div>
            ) : null}

            <div>
              <p className="eyebrow">Intent</p>
              <p>{response.intent}</p>
            </div>

            <div>
              <p className="eyebrow">SQL</p>
              <pre>{response.sql}</pre>
            </div>

            <div>
              <p className="eyebrow">Rows</p>
              <p>{rows.length} returned</p>
              <pre>{JSON.stringify(rows, null, 2)}</pre>
            </div>

            {response.warnings.length > 0 ? (
              <div>
                <p className="eyebrow">Warnings</p>
                <ul>
                  {response.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}
