import Link from 'next/link'

/** A pause in the journey, not an error. Vast empty dark space. */
export default function NotFound() {
  return (
    <div
      className="mx-auto flex w-full flex-col items-center justify-center text-center"
      style={{ maxWidth: 560, minHeight: 'calc(100dvh - 200px)', padding: 'calc(var(--u) * 3)' }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 4)' }}>
        404 — not found
      </p>
      <blockquote
        className="display italic"
        style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.5, color: 'var(--color-fg-bright)' }}
      >
        The place you&apos;re looking for is farther off than this. So it&apos;s all right —
        you&apos;ll stand up, and you&apos;ll keep walking.
      </blockquote>
      <p style={{ marginTop: 'calc(var(--u) * 2)', fontSize: 13, color: 'var(--color-fg-soft)' }}>
        (after a certain swordsman&apos;s long night)
      </p>
      <Link
        href="/"
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ marginTop: 'calc(var(--u) * 8)', color: 'var(--color-accent)' }}
      >
        ← Back to the garden
      </Link>
    </div>
  )
}
