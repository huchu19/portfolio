import type { Metadata } from 'next'
import Link from 'next/link'
import { fragmentDot } from '@/components/feed/tagColors'
import {
  getFeedGroupedByYear,
  isFragment,
  formatStamp,
  ENTRY_TYPES,
} from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Every post and fragment ever, organized by year.',
}

/** The index. A list can be a pleasure. */
export default function ArchivePage() {
  const years = getFeedGroupedByYear()

  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: 840, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}
    >
      <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 'calc(var(--u) * 8)' }}>
        Archive
      </h1>

      {years.map(([year, entries]) => (
        <section key={year} style={{ marginBottom: 'calc(var(--u) * 8)' }}>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(48px, 7vw, 84px)',
              color: 'var(--color-void-line)',
              lineHeight: 1,
              marginBottom: 'calc(var(--u) * 3)',
            }}
          >
            {year}
          </h2>
          <ol className="flex flex-col">
            {entries.map((entry) => {
              const dot = isFragment(entry)
                ? fragmentDot(entry.tags)
                : ENTRY_TYPES[entry.type].dot
              return (
                <li key={entry.permalink}>
                  <Link
                    href={entry.permalink}
                    className="group flex items-baseline gap-x-4 border-b transition-colors"
                    style={{
                      borderColor: 'var(--color-void-line)',
                      paddingBlock: 'calc(var(--u) * 1.5)',
                    }}
                  >
                    <time
                      dateTime={entry.date}
                      className="mono-label shrink-0"
                      style={{ width: 88 }}
                    >
                      {formatStamp(entry.date)}
                    </time>
                    <span
                      aria-hidden
                      className="shrink-0 self-center rounded-full"
                      style={{ width: 6, height: 6, background: dot }}
                      title={ENTRY_TYPES[entry.type].label}
                    />
                    {isFragment(entry) ? (
                      <span
                        className="line-clamp-1 min-w-0"
                        style={{ fontSize: 14.5, color: 'var(--color-ash)' }}
                      >
                        {entry.title ?? entry.excerpt}
                      </span>
                    ) : (
                      <span
                        className="display min-w-0 transition-colors group-hover:text-(--color-ember-bright)"
                        style={{ fontSize: 'clamp(17px, 2vw, 21px)', color: 'var(--color-white)' }}
                      >
                        {entry.title}
                      </span>
                    )}
                    <span className="mono-label ml-auto hidden shrink-0 sm:inline" style={{ fontSize: 10.5 }}>
                      {entry.tags.slice(0, 3).join(' · ')}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
