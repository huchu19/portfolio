import Link from 'next/link'
import EmailLink from '@/components/watcher/EmailLink'
import { site } from '@/lib/site'
import Section from './Section'

const LINKS: [string, string][] = [
  ['About', '/about'],
  ['Archive', '/archive'],
  ['Colophon', '/colophon'],
]

/**
 * The bottom of the descent. Reaching it means scrollDepth is near 100%,
 * which is the condition the Watcher's last rule waits on — so the closing
 * gesture and the emailHover signal finally live in the same place.
 */
export default function Invitation() {
  return (
    <Section
      label="Get in touch"
      className="flex flex-col justify-center"
      style={{ minHeight: '60dvh', paddingBlock: 'calc(var(--u) * 8)' }}
    >
      <p className="mono-label" style={{ color: 'var(--color-accent)' }}>
        The end of the desk
      </p>

      <h2
        className="display"
        style={{ fontSize: 'clamp(28px, 4vw, 52px)', marginTop: 'calc(var(--u) * 2)', maxWidth: '18ch' }}
      >
        You made it all the way down here.
      </h2>

      <p
        style={{
          marginTop: 'calc(var(--u) * 2)',
          fontSize: 16,
          color: 'var(--color-fg-soft)',
          maxWidth: '52ch',
        }}
      >
        That is more than most. If any of it landed — the code, the ghazals, or the
        arguments with myself — I would genuinely like to hear about it.
      </p>

      <div
        className="mono-label flex flex-wrap items-center"
        style={{ marginTop: 'calc(var(--u) * 5)', gap: 'calc(var(--u) * 4)' }}
      >
        <EmailLink email={site.email} />
        {LINKS.map(([label, href]) => (
          <Link key={href} href={href} className="transition-colors hover:text-(--color-fg)">
            {label}
          </Link>
        ))}
      </div>
    </Section>
  )
}
