import { useState, type FormEvent } from 'react'

interface QueryResponse {
  question: string
  sql: string
  intent: string
  warnings: string[]
  columns: string[]
  rows: Array<Record<string, string | number | boolean | null>>
  source?: 'postgres' | 'fallback'
}

const apiBaseUrl = 'http://localhost:8787'

export function App() {
  const [question, setQuestion] = useState('How many active users do we have?')
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const rows = response?.rows ?? []

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
