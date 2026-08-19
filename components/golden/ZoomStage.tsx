'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Option A (Fibonacci Zoom), verbatim this time: the homepage is a
 * fixed viewport into the 13×8 construction and scrolling travels the
 * spiral — one smoothed progress value drives a continuous zoom-pan
 * through the fibonacci stops. The page keeps its native scrollbar (a
 * tall track with a sticky stage), so the feed's internal scroll
 * simply chains like any nested scroll area — no wheel hijacking.
 * Chips and number keys jump between stops; Esc (or 0) pulls back.
 * Mobile + reduced-motion render the resting Golden Grid (Option C).
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
/** scroll travel per stop-to-stop transition, in viewport heights */
const SCREENS_PER_HOP = 0.9
/** progress keyframes: rest + one per stop */
const KEYS = [0, 0.25, 0.5, 0.75, 1]

function stopParams(stop: Stop | null): { s: number; cx: number; cy: number } {
  if (!stop) return { s: 1, cx: 50, cy: 50 } // identity: 50/1 − 50 = 0
  const s = stop.s ?? Math.min(GRID_W / stop.w, GRID_H / stop.h) * 0.94 // a breath of margin
  return {
    s,
    cx: ((stop.x + stop.w / 2) / GRID_W) * 100,
    cy: ((stop.y + stop.h / 2) / GRID_H) * 100,
  }
}

const PARAMS = [null, ...STOPS].map(stopParams)

export default function ZoomStage({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const zoomable = enabled && !reduced

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 })

  // zoom feels constant when scale is interpolated in log space
  const logS = useTransform(smooth, KEYS, PARAMS.map((p) => Math.log(p.s)))
  const cx = useTransform(smooth, KEYS, PARAMS.map((p) => p.cx))
  const cy = useTransform(smooth, KEYS, PARAMS.map((p) => p.cy))
  const transform = useTransform([logS, cx, cy], (values) => {
    const [l, x, y] = values as number[]
    const s = Math.exp(l)
    // origin 0 0: translate happens pre-scale, t = center/s − c, in %
    return `scale(${s.toFixed(4)}) translate(${(50 / s - x).toFixed(4)}%, ${(50 / s - y).toFixed(4)}%)`
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(STOPS.length, Math.max(0, Math.round(p * STOPS.length)))
    setActiveIdx((current) => (current === idx ? current : idx))
  })

  /** scroll the page so the smoothed progress settles on stop idx (0 = rest) */
  const goTo = useCallback((idx: number) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo(0, top + (idx / STOPS.length) * travel)
  }, [])

  useEffect(() => {
    if (!zoomable) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key === 'Escape' || e.key === '0') goTo(0)
      const i = Number.parseInt(e.key, 10)
      if (i >= 1 && i <= STOPS.length) goTo(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomable, goTo])

  return (
    <div
      ref={trackRef}
      style={{ height: zoomable ? `calc(100vh + ${STOPS.length * SCREENS_PER_HOP * 100}vh)` : 'auto' }}
    >
      <div className={zoomable ? 'zoom-sticky' : undefined}>
        <motion.div
          className="home-grid"
          style={zoomable ? { transformOrigin: '0 0', transform, willChange: 'transform' } : undefined}
        >
          {children}
        </motion.div>

        {zoomable && (
          <nav
            aria-label="Travel the spiral"
            className="mono-label absolute z-10 flex items-center max-md:hidden"
            style={{ bottom: 'calc(var(--u) * 2)', left: 'calc(var(--u) * 4)', gap: 'calc(var(--u) * 2)', fontSize: 10.5 }}
          >
            <span style={{ color: 'var(--color-line)' }}>φ</span>
            <button
              type="button"
              onClick={() => goTo(0)}
              aria-pressed={activeIdx === 0}
              className="cursor-pointer transition-colors hover:text-(--color-fg)"
              style={{ color: activeIdx === 0 ? 'var(--color-accent)' : undefined }}
            >
              13×8
            </button>
            {STOPS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i + 1)}
                aria-pressed={activeIdx === i + 1}
                className="cursor-pointer transition-colors hover:text-(--color-fg)"
                style={{ color: activeIdx === i + 1 ? 'var(--color-accent)' : undefined }}
              >
                {s.label}
              </button>
            ))}
            {activeIdx > 0 && <span style={{ color: 'var(--color-fg-soft)' }}>esc — pull back</span>}
            {activeIdx === 0 && <span style={{ color: 'var(--color-fg-soft)' }}>scroll — travel</span>}
          </nav>
        )}
      </div>
    </div>
  )
}
