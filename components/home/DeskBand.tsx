'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { now } from '@/lib/now'
import type { Shipping } from '@/lib/github'

/**
 * The one pinned moment on the page. A tall track scrolls beneath a sticky
 * panel whose *contents* advance through three states — the page never
 * freezes and the scrollbar never lies, which is the line between this and
 * the scroll-jacking REVAMP.md forbids.
 *
 * Teal appears here and nowhere else in this band: only the shipping state
 * is genuinely live. Building and Elsewhere are hand-maintained in lib/now.ts
 * and are marigold or bone accordingly.
 */

const STATES = ['Building', 'Shipping', 'Elsewhere'] as const
type StateName = (typeof STATES)[number]

export default function DeskBand({ shipping }: { shipping: Shipping | null }) {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // three equal bands across the track; clamp so the ends are reachable
    const idx = Math.min(STATES.length - 1, Math.max(0, Math.floor(p * STATES.length)))
    setActive((current) => (current === idx ? current : idx))
  })

  // Reduced motion: no track, no pin. Every state renders stacked, so the
  // same information arrives without a single moving part.
  if (reduced) {
    return (
      <section aria-label="The desk right now" style={{ paddingBlock: 'calc(var(--u) * 8)' }}>
        <DeskHeading />
        <div className="flex flex-col" style={{ gap: 'calc(var(--u) * 4)', marginTop: 'calc(var(--u) * 4)' }}>
          {STATES.map((s) => (
            <div key={s}>
              <StateLabel name={s} active />
              <StatePanel name={s} shipping={shipping} />
            </div>
          ))}
        </div>
        <DeskFooterLink />
      </section>
    )
  }

  return (
    <section aria-label="The desk right now">
      <div ref={trackRef} style={{ height: '180vh', position: 'relative' }}>
        <div
          className="flex flex-col justify-center"
          style={{ position: 'sticky', top: 0, height: '100dvh' }}
        >
          <DeskHeading />

          {/* the three names, the current one lit — the reader can see
              what is coming and what has passed, so the pin has a shape */}
          <div
            className="flex flex-wrap items-center"
            style={{ gap: 'calc(var(--u) * 3)', marginTop: 'calc(var(--u) * 3)' }}
          >
            {STATES.map((s, i) => (
              <StateLabel key={s} name={s} active={i === active} />
            ))}
          </div>

          <div
            style={{
              marginTop: 'calc(var(--u) * 4)',
              minHeight: 220, // reserved: the states differ in height, the panel must not jump
            }}
          >
            {STATES.map((s, i) =>
              i === active ? (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StatePanel name={s} shipping={shipping} />
                </motion.div>
              ) : null,
            )}
          </div>

          <DeskFooterLink />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function DeskHeading() {
  return (
    <>
      <p className="mono-label" style={{ color: 'var(--color-accent)' }}>
        Now
      </p>
      <h2
        className="display"
        style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', marginTop: 'var(--u)' }}
      >
        What the desk looks like today
      </h2>
    </>
  )
}

function DeskFooterLink() {
  return (
    <Link
      href="/now"
      className="mono-label transition-colors hover:text-(--color-fg)"
      style={{ marginTop: 'calc(var(--u) * 4)', fontSize: 11 }}
    >
      The full /now page →
    </Link>
  )
}

function StateLabel({ name, active }: { name: StateName; active: boolean }) {
  return (
    <span
      className="mono-label transition-colors"
      style={{
        fontSize: 11,
        color: active ? 'var(--color-fg)' : 'var(--color-fg-faint)',
        borderBottom: active ? '1px solid var(--color-accent)' : '1px solid transparent',
        paddingBottom: 2,
      }}
    >
      {name}
    </span>
  )
}

function StatePanel({ name, shipping }: { name: StateName; shipping: Shipping | null }) {
  if (name === 'Building') {
    return (
      <ul className="flex flex-col" style={{ gap: 'calc(var(--u) * 2)' }}>
        {now.building.map((b) => (
          <li key={b.name} className="flex flex-wrap items-baseline" style={{ gap: 'calc(var(--u) * 2)' }}>
            <span className="display" style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}>
              {b.name}
            </span>
            <span
              className="mono-label"
              style={{
                fontSize: 10.5,
                color: b.status === 'active' ? 'var(--color-accent)' : 'var(--color-fg-faint)',
              }}
            >
              {b.status}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (name === 'Shipping') {
    // The unauthenticated GitHub API is 60 req/hr and usually spent, so null
    // is the ordinary case, not the error case. It gets a real sentence.
    if (!shipping || shipping.pushes.length === 0) {
      return (
        <p
          className="mono-label"
          style={{
            fontSize: 12.5,
            color: 'var(--color-fg-faint)',
            maxWidth: '44ch',
            // a sentence, not a label — mono-label shouts in uppercase
            textTransform: 'none',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}
        >
          GitHub isn&apos;t answering right now — the commits are still happening,
          the counter just can&apos;t see them.
        </p>
      )
    }

    return (
      <div>
        <div className="flex items-baseline" style={{ gap: 'calc(var(--u) * 2)' }}>
          <span
            className="display"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--color-signal)' }}
          >
            {shipping.weekCommits}
          </span>
          <span className="mono-label" style={{ fontSize: 11 }}>
            commits this week
          </span>
        </div>

        <ul className="flex flex-col" style={{ gap: 'var(--u)', marginTop: 'calc(var(--u) * 3)' }}>
          {shipping.pushes.map((p, i) => (
            <li
              key={`${p.repo}-${i}`}
              className="mono-label flex flex-wrap items-baseline"
              style={{ gap: 'calc(var(--u) * 1.5)', fontSize: 11, textTransform: 'none', letterSpacing: '0.06em' }}
            >
              <span style={{ color: 'var(--color-signal)' }}>{p.repo}</span>
              <span className="line-clamp-1" style={{ color: 'var(--color-fg-soft)' }}>
                {p.message}
              </span>
              <span style={{ color: 'var(--color-fg-faint)' }}>{p.when}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <dl className="flex flex-col" style={{ gap: 'calc(var(--u) * 2)' }}>
      <Row term="Reading" desc={`${now.reading.title} — ${now.reading.author}`} />
      <Row term="Watching" desc={now.watching} />
      <Row term="Listening" desc={now.listening} />
      <Row term="Where" desc={now.location} />
    </dl>
  )
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-baseline" style={{ gap: 'calc(var(--u) * 2)' }}>
      <dt className="mono-label" style={{ fontSize: 10.5, minWidth: 88 }}>
        {term}
      </dt>
      <dd style={{ fontSize: 16, color: 'var(--color-fg-soft)' }}>{desc}</dd>
    </div>
  )
}
