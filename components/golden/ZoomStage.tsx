'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Option A (Fibonacci Zoom), navigation-flavored: the home grid is a
 * stage you can zoom into. Each fibonacci rectangle is a destination —
 * click its chip (or press 1–4) and the viewport travels into that
 * square along a smooth zoom-pan; Esc (or 0) pulls back to the full
 * 13×8 construction. Desktop + motion-friendly contexts only; the
 * Golden Grid (Option C) is the resting state and the full fallback.
 */

type Stop = {
  key: string
  label: string
  x: number
  y: number
  w: number
  h: number
  /** hand-tuned zoom for full-height cells where contain-fit can't travel */
  s?: number
}

const STOPS: Stop[] = [
  { key: 'intro', label: '8²', x: 0, y: 0, w: 8, h: 8, s: 1.3 },
  { key: 'feed', label: '5²', x: 8, y: 0, w: 5, h: 5 },
  { key: 'featured', label: '3²', x: 10, y: 5, w: 3, h: 3 },
  { key: 'now', label: '2²', x: 8, y: 5, w: 2, h: 3 },
]

const GRID_W = 13
const GRID_H = 8

function transformFor(stop: Stop | null): string {
  if (!stop) return 'scale(1) translate(0%, 0%)'
  const s = stop.s ?? Math.min(GRID_W / stop.w, GRID_H / stop.h) * 0.94 // a breath of margin
  const cx = ((stop.x + stop.w / 2) / GRID_W) * 100
  const cy = ((stop.y + stop.h / 2) / GRID_H) * 100
  // origin 0 0: translate happens pre-scale (right-to-left), so
  // t = center/s − c, in percentages of the element's own box
  const tx = 50 / s - cx
  const ty = 50 / s - cy
  return `scale(${s}) translate(${tx}%, ${ty}%)`
}

export default function ZoomStage({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || reduced) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key === 'Escape' || e.key === '0') setActive(null)
      const i = Number.parseInt(e.key, 10)
      if (i >= 1 && i <= STOPS.length) setActive(STOPS[i - 1].key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, reduced])

  const zoomable = enabled && !reduced
  const stop = STOPS.find((s) => s.key === active) ?? null

  return (
    <div className="relative">
      <motion.div
        className="home-grid"
        style={{ transformOrigin: '0 0' }}
        animate={{ transform: transformFor(zoomable ? stop : null) }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {zoomable && (
        <nav
          aria-label="Zoom into a rectangle"
          className="mono-label absolute z-10 flex items-center max-md:hidden"
          style={{ bottom: 'calc(var(--u) * 2)', left: 'calc(var(--u) * 4)', gap: 'calc(var(--u) * 2)', fontSize: 10.5 }}
        >
          <span style={{ color: 'var(--color-void-line)' }}>φ</span>
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className="cursor-pointer transition-colors hover:text-(--color-bone)"
            style={{ color: active === null ? 'var(--color-ember)' : undefined }}
          >
            13×8
          </button>
          {STOPS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive((a) => (a === s.key ? null : s.key))}
              aria-pressed={active === s.key}
              className="cursor-pointer transition-colors hover:text-(--color-bone)"
              style={{ color: active === s.key ? 'var(--color-ember)' : undefined }}
            >
              {s.label}
            </button>
          ))}
          {active && <span style={{ color: 'var(--color-ash)' }}>esc — pull back</span>}
        </nav>
      )}
    </div>
  )
}
