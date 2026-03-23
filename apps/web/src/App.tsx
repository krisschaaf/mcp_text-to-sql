export function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">mcp_text-to-sql</p>
        <h1>Chat to SQL, one safe slice at a time.</h1>
        <p className="lede">
          This starter app wires the future chat UI, MCP server, and database flow together with a
          minimal workspace scaffold.
        </p>
      </section>

      <section className="panel">
        <label htmlFor="question">Ask a question</label>
        <textarea id="question" rows={5} placeholder="How many active users signed up last week?" />
        <button type="button">Generate SQL</button>
      </section>
    </main>
  )
}
