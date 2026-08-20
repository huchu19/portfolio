'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { now } from '@/lib/now'
import type { Shipping } from '@/lib/github'

/**
 * What's on the screen the figure is facing. Absorbs the old DeskBand's
 * Building/Shipping/Elsewhere telemetry wholesale — same content, same
 * teal-only-for-live-data discipline — but advances on a timer instead of
 * scroll position, since the scene has no dedicated scroll track to hang
 * it on. Used two places: small, inside the monitor outline on wide
 * viewports, and as a plain compact card atop WallGrid on narrow ones or
 * under reduced motion. Owns its own reduced-motion check either way.
 */

const STATES = ['Building', 'Shipping', 'Elsewhere'] as const
type StateName = (typeof STATES)[number]

const CYCLE_MS = 6500

export default function DeskScreen({ shipping }: { shipping: Shipping | null }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const tick = setInterval(() => {
      if (document.hidden) return
      setActive((i) => (i + 1) % STATES.length)
    }, CYCLE_MS)
    return () => clearInterval(tick)
  }, [reduced, paused])

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: 'var(--color-raised)',
        borderRadius: 6,
        padding: 'calc(var(--u) * 1.25)',
        gap: 6,
        overflow: 'hidden',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center" style={{ gap: 7 }}>
        {STATES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(i)}
            className="transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              fontSize: 7,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: i === active ? 'var(--color-fg)' : 'var(--color-fg-faint)',
              borderBottom: i === active ? '1px solid var(--color-accent)' : '1px solid transparent',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={STATES[active]}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          >
            <StatePanel name={STATES[active]} shipping={shipping} />
          </motion.div>
        </AnimatePresence>
      </div>

      <Link
        href="/now"
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ fontSize: 8.5 }}
      >
        /now →
      </Link>
    </div>
  )
}

function StatePanel({ name, shipping }: { name: StateName; shipping: Shipping | null }) {
  if (name === 'Building') {
    return (
      <ul className="flex flex-col" style={{ gap: 'calc(var(--u) * 0.75)' }}>
        {now.building.slice(0, 1).map((b) => (
          <li key={b.name} className="flex flex-wrap items-baseline" style={{ gap: 'var(--u)' }}>
            <span style={{ fontSize: 11.5, color: 'var(--color-fg)' }}>{b.name}</span>
            <span
              className="mono-label"
              style={{ fontSize: 8, color: b.status === 'active' ? 'var(--color-accent)' : 'var(--color-fg-faint)' }}
            >
              {b.status}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (name === 'Shipping') {
    if (!shipping || shipping.pushes.length === 0) {
      return (
        <p style={{ fontSize: 10.5, color: 'var(--color-fg-faint)', lineHeight: 1.5 }}>
          GitHub isn&apos;t answering right now.
        </p>
      )
    }
    return (
      <div>
        <div className="flex items-baseline" style={{ gap: 'var(--u)' }}>
          <span style={{ fontSize: 20, color: 'var(--color-signal)' }}>{shipping.weekCommits}</span>
          <span className="mono-label" style={{ fontSize: 8 }}>
            commits this week
          </span>
        </div>
        <ul className="flex flex-col" style={{ gap: 2, marginTop: 'var(--u)' }}>
          {shipping.pushes.slice(0, 2).map((p, i) => (
            <li
              key={`${p.repo}-${i}`}
              className="mono-label line-clamp-1"
              style={{ fontSize: 8, textTransform: 'none', letterSpacing: '0.04em', color: 'var(--color-fg-soft)' }}
            >
              <span style={{ color: 'var(--color-signal)' }}>{p.repo}</span> {p.message}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <dl className="flex flex-col" style={{ gap: 4 }}>
      <Row term="Reading" desc={now.reading.title} />
      <Row term="Watching" desc={now.watching} />
      <Row term="Where" desc={now.location} />
    </dl>
  )
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-baseline" style={{ gap: 6 }}>
      <dt className="mono-label" style={{ fontSize: 7.5, minWidth: 46 }}>
        {term}
      </dt>
      <dd className="line-clamp-1" style={{ fontSize: 10.5, color: 'var(--color-fg-soft)' }}>
        {desc}
      </dd>
    </div>
  )
}
