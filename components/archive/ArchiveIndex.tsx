'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { emitFeedback } from '@/lib/feedback'

export type ArchiveItem = {
  permalink: string
  date: string
  stamp: string
  type: 'project' | 'note' | 'journal' | 'fragment'
  title: string
  tags: string[]
  dot: string
  fragment: boolean
}

const FILTERS = [
  ['all', 'All'], ['project', 'Projects'], ['note', 'Essays & notes'],
  ['journal', 'Journal'], ['fragment', 'Fragments'], ['poetry', 'Poetry'],
] as const

export default function ArchiveIndex({ entries }: { entries: ArchiveItem[] }) {
  const [filter, setFilter] = useState('all')
  const [sorting, setSorting] = useState(false)
  const sortTimer = useRef<number | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFilter(params.get('tag') === 'poetry' ? 'poetry' : params.get('type') ?? 'all')
  }, [])

  useEffect(() => () => {
    if (sortTimer.current) window.clearTimeout(sortTimer.current)
  }, [])

  const filtered = useMemo(() => entries.filter((entry) => {
    if (filter === 'all') return true
    if (filter === 'poetry') return entry.tags.includes('poetry')
    return entry.type === filter
  }), [entries, filter])

  const years = useMemo(() => {
    const groups = new Map<string, ArchiveItem[]>()
    filtered.forEach((entry) => {
      const year = entry.date.slice(0, 4)
      groups.set(year, [...(groups.get(year) ?? []), entry])
    })
    return [...groups.entries()]
  }, [filtered])

  const choose = (value: string) => {
    if (value === filter) return
    setFilter(value)
    setSorting(true)
    if (sortTimer.current) window.clearTimeout(sortTimer.current)
    sortTimer.current = window.setTimeout(() => {
      setSorting(false)
      emitFeedback('settle')
    }, 310)
    const url = value === 'all' ? '/archive' : value === 'poetry' ? '/archive?tag=poetry' : `/archive?type=${value}`
    window.history.replaceState(null, '', url)
  }

  return (
    <>
      <div className="archive-filter-desk" role="toolbar" aria-label="Filter archive" data-sorting={sorting ? 'true' : 'false'}>
        {FILTERS.map(([value, label]) => (
          <button key={value} type="button" data-tactile aria-pressed={filter === value} onClick={() => choose(value)}>
            {label}<span>{entries.filter((entry) => value === 'all' || value === 'poetry' ? value === 'all' || entry.tags.includes('poetry') : entry.type === value).length}</span>
          </button>
        ))}
      </div>

      <div className="archive-live-count" aria-live="polite">{filtered.length} pieces on the desk</div>

      <AnimatePresence mode="popLayout" initial={false}>
        {years.map(([year, items]) => (
          <motion.section layout key={year} className="archive-year" style={{ marginBottom: 'calc(var(--u) * 8)' }}>
            <motion.h2 layout className="display">{year}</motion.h2>
            <motion.ol layout className="flex flex-col">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((entry) => (
                  <motion.li
                    layout
                    key={entry.permalink}
                    className="paper-arrival"
                    initial={reduced ? false : { opacity: 0, y: 12, rotate: -0.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={entry.permalink} className="group flex items-baseline gap-x-4 border-b transition-colors">
                      <time dateTime={entry.date} className="mono-label shrink-0">{entry.stamp}</time>
                      <span aria-hidden className="archive-dot shrink-0 self-center rounded-full" style={{ background: entry.dot }} />
                      <span className={entry.fragment ? 'line-clamp-1 min-w-0 archive-fragment-title' : 'display min-w-0 transition-colors group-hover:text-(--color-accent-bright)'}>
                        {entry.title}
                      </span>
                      <span className="mono-label ml-auto hidden shrink-0 sm:inline">{entry.tags.slice(0, 3).join(' · ')}</span>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ol>
          </motion.section>
        ))}
      </AnimatePresence>
    </>
  )
}
