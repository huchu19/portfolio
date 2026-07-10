'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { POST_TYPES, POST_TYPE_ORDER, type PostType } from '@/lib/posts'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  active: PostType | null
  counts: Partial<Record<PostType, number>>
  total: number
  onChange: (type: PostType | null) => void
}

/**
 * Sticky filter pills — All / Projects / Essays / Poetry / Journal /
 * Adventures — with a gradient fade into the page below. The active
 * ring slides between pills via a shared layoutId.
 */
export default function FilterBar({ active, counts, total, onChange }: Props) {
  const reduced = useReducedMotion()

  const items: { key: PostType | null; label: string; count: number }[] = [
    { key: null, label: 'All', count: total },
    ...POST_TYPE_ORDER.map((t) => ({
      key: t as PostType | null,
      label: POST_TYPES[t].plural,
      count: counts[t] ?? 0,
    })),
  ]

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-paper pt-4 pb-3">
        <div
          role="group"
          aria-label="Filter entries by type"
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map(({ key, label, count }) => {
            const isActive = active === key
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange(key)}
                className={`relative shrink-0 rounded-full px-4 py-1.5 meta-mono transition-colors duration-300 ease-soft ${
                  isActive ? 'text-accent-deep' : 'hover:text-ink'
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId={reduced ? undefined : 'pill-ring'}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-accent-deep"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-line"
                  />
                )}
                <span className="relative">{label}</span>{' '}
                <span
                  className={`relative tabular-nums ${
                    isActive ? 'text-accent-deep' : 'text-ink-faint'
                  }`}
                >
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none h-6 bg-linear-to-b from-paper to-transparent"
      />
    </div>
  )
}
