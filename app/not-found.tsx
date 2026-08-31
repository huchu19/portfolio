import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="mx-auto flex w-full flex-col items-center justify-center text-center"
      style={{ maxWidth: 560, minHeight: 'calc(100dvh - 200px)', padding: 'calc(var(--u) * 3)' }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 4)' }}>
        404 — not found
      </p>
      <h1 className="display" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>Page not found</h1>
      <Link
        href="/"
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ marginTop: 'calc(var(--u) * 8)', color: 'var(--color-accent)' }}
      >
        ← Back to projects
      </Link>
    </div>
  )
}
