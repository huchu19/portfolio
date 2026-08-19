import type { RepoFacts } from '@/lib/github'

/**
 * The live half of a project dossier. Everything here comes from the
 * GitHub API at build/revalidate time and is set in teal, so a reader
 * learns without being told that teal means "this is true right now".
 *
 * Renders nothing at all when the API gave us nothing — a dossier with
 * static rows only is a complete dossier.
 */
export default function RepoFactsTable({ facts }: { facts: RepoFacts | null }) {
  if (!facts) return null

  const total = Object.values(facts.languages).reduce((a, b) => a + b, 0)
  const bars = total
    ? Object.entries(facts.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }))
    : []

  return (
    <section
      aria-label="Live repository facts"
      style={{
        marginBottom: 'calc(var(--u) * 5)',
        padding: 'calc(var(--u) * 3)',
        border: '1px solid var(--color-line)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <div
        className="mono-label"
        style={{ color: 'var(--color-signal)', marginBottom: 'calc(var(--u) * 2)' }}
      >
        Live · from the repository
      </div>

      <dl
        className="font-(family-name:--font-mono)"
        style={{ fontSize: 13, display: 'grid', gap: 'var(--u)', fontVariantNumeric: 'tabular-nums' }}
      >
        <Row label="Last push" value={facts.pushedLabel} />
        <Row label="Stars" value={String(facts.stars)} />
        {facts.language && <Row label="Primary" value={facts.language} />}
      </dl>

      {bars.length > 0 && (
        <div style={{ marginTop: 'calc(var(--u) * 3)' }}>
          <div
            aria-hidden
            className="flex overflow-hidden"
            style={{ height: 4, borderRadius: 2, background: 'var(--color-raised)' }}
          >
            {bars.map((b, i) => (
              <span
                key={b.name}
                style={{
                  width: `${b.pct}%`,
                  background: 'var(--color-signal)',
                  // each slice a step quieter, so the bar reads as one language stack
                  opacity: 1 - i * 0.17,
                }}
              />
            ))}
          </div>
          <div
            className="mono-label flex flex-wrap"
            style={{ gap: 'var(--u) calc(var(--u) * 2)', marginTop: 'var(--u)', fontSize: 10.5 }}
          >
            {bars.map((b) => (
              <span key={b.name}>
                {b.name} {b.pct.toFixed(0)}%
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between" style={{ gap: 'calc(var(--u) * 2)' }}>
      <dt style={{ color: 'var(--color-fg-faint)' }}>{label}</dt>
      <dd style={{ color: 'var(--color-signal)' }}>{value}</dd>
    </div>
  )
}
