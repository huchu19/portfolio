'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useTransform } from 'framer-motion'
import { useReadingProgress } from '@/hooks/useReadingProgress'

/**
 * The adventure route, lived rather than stated: a flight arc between
 * the hops that draws itself with reading progress — ember fire along
 * the cold wave-toned path, each airport lighting as you pass it. One
 * smoothed progress value drives everything (fable-25's scroll rule).
 * Sticks below the header on md+ so the journey rides with the read.
 * Reduced motion: the whole route rendered complete, no subscription.
 */
export default function RouteArc({ route }: { route: string[] }) {
  const holderRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement | null>(null)
  const [passed, setPassed] = useState(0)

  useLayoutEffect(() => {
    articleRef.current = holderRef.current?.closest('article') ?? null
  }, [])

  const { smooth, reduced } = useReadingProgress(articleRef)
  const dashoffset = useTransform(smooth, [0, 1], [1, 0])

  const n = route.length
  useMotionValueEvent(smooth, 'change', (p) => {
    const count = Math.min(n - 1, Math.floor(p * (n - 1) + 0.02))
    setPassed((current) => (current === count ? current : count))
  })

  // nodes at even fractions of a 0–100 span; arcs bulge upward.
  // NOTE: no vector-effect on these paths — Chrome ignores pathLength
  // normalization under non-scaling-stroke and renders repeating dashes.
  const xs = route.map((_, i) => (i / (n - 1)) * 100)
  const NODE_Y = 4
  const PEAK_Y = 0.8
  const arcPath = xs
    .map((x, i) =>
      i === 0
        ? `M ${x} ${NODE_Y}`
        : `Q ${((xs[i - 1] + x) / 2).toFixed(2)} ${PEAK_Y} ${x} ${NODE_Y}`,
    )
    .join(' ')

  const lit = (i: number) => reduced || i <= passed || i === 0

  return (
    <div ref={holderRef} className="route-arc" aria-label={`Route: ${route.join(' to ')}`}>
      <div className="relative" style={{ height: 64, marginInline: 28 }}>
        <svg
          viewBox="0 0 100 5"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-x-0"
          style={{ top: 8, height: 40, width: '100%', overflow: 'visible' }}
        >
          <path d={arcPath} fill="none" stroke="var(--color-wave)" strokeWidth={0.22} opacity={0.35} />
          <motion.path
            d={arcPath}
            fill="none"
            stroke="var(--color-ember)"
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray="1"
            style={reduced ? { strokeDashoffset: 0 } : { strokeDashoffset: dashoffset }}
          />
        </svg>
        {route.map((stop, i) => (
          <span
            key={`${stop}-${i}`}
            data-passed={lit(i) || undefined}
            className="route-arc-node font-(family-name:--font-mono)"
            style={{ left: `${xs[i]}%` }}
          >
            {stop}
          </span>
        ))}
      </div>
    </div>
  )
}
