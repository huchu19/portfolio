import type { Metadata } from 'next'
import { getShipping } from '@/lib/github'
import { now } from '@/lib/now'
import { formatDate } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Now',
  description: 'Telemetry board — what is happening right now.',
}

function Card({
  label,
  children,
  accent,
}: {
  label: string
  children: React.ReactNode
  accent?: string
}) {
  return (
    <section
      className="panel flex flex-col"
      style={{ padding: 'calc(var(--u) * 3)', gap: 'calc(var(--u) * 2)' }}
    >
      <h2 className="mono-label" style={{ color: accent ?? 'var(--color-accent)' }}>
        {label}
      </h2>
      <div style={{ fontSize: 15, color: 'var(--color-fg)' }}>{children}</div>
    </section>
  )
}

export default async function NowPage() {
  const shipping = await getShipping()

  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: 960, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}
    >
      <header style={{ marginBottom: 'calc(var(--u) * 6)' }}>
        <p className="mono-label" style={{ marginBottom: 'var(--u)' }}>
          Last updated <time dateTime={now.updated}>{formatDate(now.updated)}</time>
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
          Now
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 'calc(var(--u) * 2)' }}>
        <Card label="Building">
          <ul className="flex flex-col" style={{ gap: 'var(--u)' }}>
            {now.building.map((b) => (
              <li key={b.name} className="flex items-baseline gap-2">
                <span
                  aria-hidden
                  className="inline-block shrink-0 rounded-full"
                  style={{
                    width: 7,
                    height: 7,
                    background: b.status === 'active' ? 'var(--color-accent)' : 'var(--color-fg-soft)',
                  }}
                />
                <span>
                  {b.name}
                  <span className="mono-label" style={{ marginLeft: 8, fontSize: 10 }}>
                    {b.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card label="Reading" accent="var(--color-fg-soft)">
          <p>
            <em className="display italic" style={{ fontSize: 18 }}>{now.reading.title}</em>
            {' — '}
            {now.reading.author}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-fg-soft)', marginTop: 4 }}>{now.reading.note}</p>
        </Card>

        <Card label="Watching" accent="var(--color-fg-soft)">
          <p>{now.watching}</p>
        </Card>

        <Card label="Listening" accent="var(--color-fg-soft)">
          <p>{now.listening}</p>
        </Card>

        <Card label="Job hunt">
          <p>{now.jobHunt}</p>
          {shipping && (
            <p className="mono-label" style={{ marginTop: 'var(--u)', fontSize: 11 }}>
              {shipping.weekCommits} commits pushed this week
            </p>
          )}
        </Card>

        <Card label="Thinking about">
          <p className="display italic" style={{ fontSize: 17, lineHeight: 1.5 }}>{now.thinking}</p>
        </Card>

        <Card label="Location" accent="var(--color-fg-soft)">
          <p>{now.location}</p>
        </Card>

        {shipping && shipping.pushes.length > 0 && (
          <Card label="Recently shipped" accent="var(--color-fg-soft)">
            <ul className="flex flex-col" style={{ gap: 'var(--u)', fontSize: 13 }}>
              {shipping.pushes.map((p) => (
                <li key={`${p.repo}-${p.when}`}>
                  <span className="mono-label" style={{ fontSize: 10.5, color: 'var(--color-signal)' }}>
                    {p.repo}
                  </span>{' '}
                  {p.message}
                  <span style={{ color: 'var(--color-fg-soft)' }}> · {p.when}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
