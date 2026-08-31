'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { FeedItem, FeedItemType } from '@/components/feed/types'

const TYPE_ORDER: FeedItemType[] = ['project', 'note', 'journal', 'fragment']

const TYPE_LABEL: Record<FeedItemType, string> = {
  project: 'Projects',
  note: 'Notes',
  journal: 'Journal',
  fragment: 'Fragments',
}

const TYPE_DOT: Record<FeedItemType, string> = {
  project: 'var(--dot-project)',
  note: 'var(--dot-note)',
  journal: 'var(--dot-journal)',
  fragment: 'var(--dot-fragment)',
}

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Khwabon Ka Bagh', href: '/blog/khwabon-ka-bagh' },
  { label: 'Contact', href: '/#contact' },
]

type Result = {
  label: string
  sub?: string
  href: string
  dot: string
}

/**
 * The command palette — primary navigation (VISION Part 8). ⌘K opens it;
 * instant search across all posts and fragments, grouped, keyboard-driven.
 */
export default function CommandPalette({ items }: { items: FeedItem[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const reduced = useReducedMotion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // wait for the enter animation to mount the input
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const groups = useMemo((): { label: string; results: Result[] }[] => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return [
        { label: 'Go to', results: QUICK_LINKS.map((l) => ({ label: l.label, href: l.href, dot: 'var(--color-accent)' })) },
        {
          label: 'Recent',
          results: items.slice(0, 5).map((i) => toResult(i)),
        },
      ]
    }
    const matches = items.filter((i) =>
      [i.title ?? '', i.excerpt, i.tags.join(' ')].join(' ').toLowerCase().includes(q),
    )
    const pageMatches = QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(q))
    const byType = TYPE_ORDER.map((t) => ({
      label: TYPE_LABEL[t],
      results: matches.filter((m) => m.type === t).map((i) => toResult(i)),
    })).filter((g) => g.results.length > 0)
    if (pageMatches.length > 0) {
      byType.unshift({
        label: 'Pages',
        results: pageMatches.map((l) => ({ label: l.label, href: l.href, dot: 'var(--color-accent)' })),
      })
    }
    return byType
  }, [query, items])

  const flat = useMemo(() => groups.flatMap((g) => g.results), [groups])

  const go = useCallback(
    (r: Result) => {
      setOpen(false)
      if (r.href) router.push(r.href)
    },
    [router],
  )

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && flat[active]) {
      e.preventDefault()
      go(flat[active])
    }
  }

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  let index = -1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-start justify-center"
          style={{ background: 'color-mix(in srgb, var(--color-bg) 72%, transparent)', paddingTop: '14vh' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="command-blotter flex w-full flex-col overflow-hidden"
            style={{
              maxWidth: 600,
              maxHeight: '62vh',
              margin: '0 calc(var(--u) * 2)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-line)',
              boxShadow: '0 24px 80px -24px rgba(0,0,0,0.8)',
            }}
            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97, rotate: -0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98, rotate: 0.35 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search projects…"
              aria-label="Search projects"
              className="palette-input w-full bg-transparent"
              style={{
                padding: 'calc(var(--u) * 2) calc(var(--u) * 3)',
                fontSize: 16,
                color: 'var(--color-fg-bright)',
                borderBottom: '1px solid var(--color-line)',
                fontFamily: 'var(--font-body)',
              }}
            />
            <div ref={listRef} className="overflow-y-auto" style={{ padding: 'var(--u) 0' }}>
              {flat.length === 0 && (
                <p className="mono-label" style={{ padding: 'calc(var(--u) * 3)' }}>
                  No project found.
                </p>
              )}
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="mono-label" style={{ padding: 'var(--u) calc(var(--u) * 3)', fontSize: 10.5 }}>
                    {group.label}
                  </div>
                  {group.results.map((r) => {
                    index++
                    const i = index
                    return (
                      <button
                        key={`${r.href}-${i}`}
                        type="button"
                        data-index={i}
                        onClick={() => go(r)}
                        onMouseMove={() => setActive(i)}
                        className="flex w-full cursor-pointer items-baseline gap-3 text-left"
                        style={{
                          padding: 'var(--u) calc(var(--u) * 3)',
                          background: i === active ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent',
                          borderLeft: i === active ? '2px solid var(--color-accent)' : '2px solid transparent',
                        }}
                      >
                        <span aria-hidden className="shrink-0 self-center rounded-full" style={{ width: 6, height: 6, background: r.dot }} />
                        <span className="line-clamp-1" style={{ fontSize: 14.5, color: 'var(--color-fg)' }}>{r.label}</span>
                        {r.sub && (
                          <span className="mono-label ml-auto shrink-0" style={{ fontSize: 10 }}>{r.sub}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
            <div
              className="mono-label flex gap-4"
              style={{ padding: 'var(--u) calc(var(--u) * 3)', borderTop: '1px solid var(--color-line)', fontSize: 10 }}
            >
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function toResult(i: FeedItem): Result {
  return {
    label: i.title ?? i.excerpt,
    sub: i.stamp,
    href: i.permalink,
    dot: TYPE_DOT[i.type],
  }
}
