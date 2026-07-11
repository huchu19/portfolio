'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fragmentDot } from '@/components/feed/tagColors'
import type { FeedItem, FeedItemType } from '@/components/feed/types'

const TYPE_ORDER: FeedItemType[] = [
  'project',
  'essay',
  'poetry',
  'journal',
  'adventure',
  'fragment',
]

const TYPE_LABEL: Record<FeedItemType, string> = {
  project: 'Projects',
  essay: 'Essays',
  poetry: 'Poetry',
  journal: 'Journal',
  adventure: 'Adventures',
  fragment: 'Fragments',
}

const TYPE_DOT: Record<FeedItemType, string> = {
  project: 'var(--dot-project)',
  essay: 'var(--dot-essay)',
  poetry: 'var(--dot-poetry)',
  journal: 'var(--dot-journal)',
  adventure: 'var(--dot-adventure)',
  fragment: 'var(--dot-fragment)',
}

const QUICK_LINKS = [
  { label: 'Home — the golden grid', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Now', href: '/now' },
  { label: 'Archive', href: '/archive' },
  { label: 'Colophon', href: '/colophon' },
]

type Result = { label: string; sub?: string; href: string; dot: string }

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
        { label: 'Go to', results: QUICK_LINKS.map((l) => ({ label: l.label, href: l.href, dot: 'var(--color-ember)' })) },
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
        results: pageMatches.map((l) => ({ label: l.label, href: l.href, dot: 'var(--color-ember)' })),
      })
    }
    return byType
  }, [query, items])

  const flat = useMemo(() => groups.flatMap((g) => g.results), [groups])

  const go = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
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
      go(flat[active].href)
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
          style={{ background: 'color-mix(in srgb, var(--color-void) 72%, transparent)', paddingTop: '14vh' }}
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
            className="flex w-full flex-col overflow-hidden rounded-lg"
            style={{
              maxWidth: 600,
              maxHeight: '62vh',
              margin: '0 calc(var(--u) * 2)',
              background: 'var(--color-void-raised)',
              border: '1px solid var(--color-void-line)',
              boxShadow: '0 24px 80px -24px rgba(0,0,0,0.8)',
            }}
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search the universe…"
              aria-label="Search all posts and fragments"
              className="w-full bg-transparent outline-none"
              style={{
                padding: 'calc(var(--u) * 2) calc(var(--u) * 3)',
                fontSize: 16,
                color: 'var(--color-white)',
                borderBottom: '1px solid var(--color-void-line)',
                fontFamily: 'var(--font-body)',
              }}
            />
            <div ref={listRef} className="overflow-y-auto" style={{ padding: 'var(--u) 0' }}>
              {flat.length === 0 && (
                <p className="mono-label" style={{ padding: 'calc(var(--u) * 3)' }}>
                  Nothing found — the garden holds no such flower.
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
                        onClick={() => go(r.href)}
                        onMouseMove={() => setActive(i)}
                        className="flex w-full cursor-pointer items-baseline gap-3 text-left"
                        style={{
                          padding: 'var(--u) calc(var(--u) * 3)',
                          background: i === active ? 'color-mix(in srgb, var(--color-ember) 12%, transparent)' : 'transparent',
                          borderLeft: i === active ? '2px solid var(--color-ember)' : '2px solid transparent',
                        }}
                      >
                        <span aria-hidden className="shrink-0 self-center rounded-full" style={{ width: 6, height: 6, background: r.dot }} />
                        <span className="line-clamp-1" style={{ fontSize: 14.5, color: 'var(--color-bone)' }}>{r.label}</span>
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
              style={{ padding: 'var(--u) calc(var(--u) * 3)', borderTop: '1px solid var(--color-void-line)', fontSize: 10 }}
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
    dot: i.type === 'fragment' ? fragmentDot(i.tags) : TYPE_DOT[i.type],
  }
}
