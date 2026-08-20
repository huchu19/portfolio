'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import FeedPanel, { panelShape, fragmentDot } from './FeedPanel'
import type { FeedItem, FeedItemType } from './types'

const FILTERS: { value: FeedItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'project', label: 'Projects' },
  { value: 'note', label: 'Notes' },
  { value: 'journal', label: 'Journal' },
  { value: 'fragment', label: 'Fragments' },
]

/**
 * The feed panel grid — fibonacci-shaped panels per content type,
 * filter toggles synced to ?type= (and ?tag= within fragments).
 */
export default function Feed({ items }: { items: FeedItem[] }) {
  const params = useSearchParams()
  const reduced = useReducedMotion()
  const type = (params.get('type') ?? 'all') as FeedItemType | 'all'
  const tag = params.get('tag')

  let filtered = type === 'all' ? items : items.filter((i) => i.type === type)
  if (type === 'fragment' && tag) {
    filtered = filtered.filter((i) => i.tags.includes(tag))
  }

  const fragmentTags =
    type === 'fragment'
      ? [...new Set(items.filter((i) => i.type === 'fragment').flatMap((i) => i.tags))]
      : []

  return (
    <div className="flex flex-col">
      <nav
        aria-label="Filter feed"
        className="feed-filter-rail flex flex-wrap"
        style={{ gap: 'var(--u) calc(var(--u) * 2)' }}
      >
        {FILTERS.map((f) => {
          const active = type === f.value
          return (
            <Link
              key={f.value}
              href={f.value === 'all' ? '?' : `?type=${f.value}`}
              scroll={false}
              className="mono-label transition-colors"
              aria-current={active ? 'true' : undefined}
              style={{
                color: active ? 'var(--color-fg)' : undefined,
                borderBottom: active ? '1px solid var(--color-accent)' : '1px solid transparent',
                paddingBottom: 2,
              }}
            >
              {f.label}
            </Link>
          )
        })}
      </nav>

      {fragmentTags.length > 0 && (
        <nav aria-label="Filter fragments by tag" className="flex flex-wrap items-center" style={{ gap: 'var(--u) calc(var(--u) * 2)', paddingBottom: 'calc(var(--u) * 2)' }}>
          {fragmentTags.map((t) => {
            const active = tag === t
            return (
              <Link
                key={t}
                href={active ? '?type=fragment' : `?type=fragment&tag=${t}`}
                scroll={false}
                className="mono-label flex items-center gap-1.5 transition-colors"
                style={{ fontSize: 11, color: active ? 'var(--color-fg)' : undefined }}
              >
                <span aria-hidden className="rounded-full" style={{ width: 5, height: 5, background: fragmentDot([t]) }} />
                {t}
              </Link>
            )
          })}
        </nav>
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap: 'calc(var(--u) * 2)', gridAutoRows: 'minmax(128px, auto)', gridAutoFlow: 'dense' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.permalink}
              data-entry-index={i}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className={`${panelShape(item)} max-sm:col-span-1`}
            >
              <FeedPanel item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="mono-label col-span-full self-center justify-self-center" style={{ padding: 'calc(var(--u) * 6)' }}>
            Nothing here yet — the garden is still growing.
          </p>
        )}
      </div>
    </div>
  )
}
