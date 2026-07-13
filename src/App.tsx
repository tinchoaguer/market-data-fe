import { wording } from '@market-data/brand/wording'

function App() {
  return (
    <main
      style={{
        padding: 'var(--space-8)',
        maxWidth: '40rem',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 'var(--font-size-sm)',
          letterSpacing: 'var(--letter-spacing-wide)',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {wording.product.nameShort}
      </p>
      <h1
        style={{
          margin: 'var(--space-2) 0',
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: 'var(--letter-spacing-tight)',
        }}
      >
        {wording.product.name}
      </h1>
      <p
        style={{
          margin: 0,
          color: 'var(--color-text-muted)',
          maxWidth: '32rem',
        }}
      >
        {wording.product.tagline}
      </p>
    </main>
  )
}

export default App
