import Link from 'next/link'
import { fragmentDot } from '@/components/feed/tagColors'
import type { FeedItem } from '@/components/feed/types'
import Section from './Section'

/**
 * The offcuts. Fragments only surfaced behind a feed filter before, which
 * meant the shortest writing on the site was also the hardest to reach.
 * Here they are the reward for having scrolled past the long-form.
 */
export default function FragmentStrip({ items }: { items: FeedItem[] }) {
  if (items.length === 0) return null

  return (
    <Section label="Fragments" style={{ paddingBlock: 'calc(var(--u) * 8)' }}>
      <div
        className="flex flex-wrap items-baseline justify-between"
        style={{ gap: 'calc(var(--u) * 2)', marginBottom: 'calc(var(--u) * 4)' }}
      >
        <div>
          <p className="mono-label" style={{ color: 'var(--color-accent)' }}>
            Fragments
          </p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginTop: 'var(--u)' }}
          >
            Things too short to be entries
          </h2>
        </div>
        <Link
          href="/?type=fragment"
          className="mono-label transition-colors hover:text-(--color-fg)"
          style={{ fontSize: 11 }}
        >
          All fragments →
        </Link>
      </div>

      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        style={{ gap: 'calc(var(--u) * 2)' }}
      >
        {items.map((item) => (
          <li key={item.permalink}>
            <Link
              href={item.permalink}
              className="panel flex h-full flex-col justify-between"
              style={{ padding: 'calc(var(--u) * 2)', gap: 'calc(var(--u) * 2)' }}
            >
              {/* Excerpts are frequently mixed-script — an Urdu couplet with
                  English commentary around it. Forcing dir="rtl" on the block
                  centres and reflows the Latin half, so the excerpt stays LTR
                  and lets the Nastaliq run shape itself inline, matching how
                  FeedPanel already renders fragments. */}
              <p
                className="line-clamp-4"
                style={{ fontSize: 14.5, color: 'var(--color-fg-soft)', lineHeight: 1.55 }}
              >
                {item.excerpt}
              </p>
              <div className="mono-label flex items-center" style={{ gap: 'var(--u)', fontSize: 10.5 }}>
                <span
                  aria-hidden
                  className="rounded-full"
                  style={{ width: 5, height: 5, background: fragmentDot(item.tags) }}
                />
                <span>{item.stamp}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
