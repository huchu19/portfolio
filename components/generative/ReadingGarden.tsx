'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { seededRng, stems, type Stem } from '@/lib/generative'

/**
 * Second person, made literal: reading a post grows a small seeded
 * garden in the left gutter — moss stalks rooted at the bottom of the
 * viewport, each drawing itself over its own slice of the read, and
 * one ember bloom that only opens when you finish. Wide screens only
 * (the right gutter belongs to the Tufte footnotes); decoration, so
 * aria-hidden and untouchable. Reduced motion: fully grown, static.
 */

const STEM_COUNT = 7

function GardenLeaf({
  leaf,
  smooth,
  window: [w0, w1],
  reduced,
}: {
  leaf: Stem['leaves'][number]
  smooth: MotionValue<number>
  window: [number, number]
  reduced: boolean
}) {
  const at = w0 + leaf.t * (w1 - w0)
  const grow = useTransform(smooth, [at, Math.min(1, at + 0.06)], [0, 1])
  return (
    // rotation lives on the group: a CSS scale on the ellipse would
    // override an attribute transform on the same element
    <g transform={`rotate(${leaf.angle.toFixed(1)} ${leaf.x} ${leaf.y})`}>
      <motion.ellipse
        cx={leaf.x}
        cy={leaf.y}
        rx={leaf.size}
        ry={leaf.size * 0.42}
        fill="var(--color-moss)"
        opacity={0.75}
        style={reduced ? undefined : { scale: grow, transformOrigin: `${leaf.x}px ${leaf.y}px` }}
      />
    </g>
  )
}

function GardenStem({
  stem,
  index,
  smooth,
  reduced,
  last,
}: {
  stem: Stem
  index: number
  smooth: MotionValue<number>
  reduced: boolean
  last: boolean
}) {
  // each stalk grows over its own staggered slice of the read
  const w0 = (index / (STEM_COUNT + 1)) * 0.8
  const w1 = Math.min(1, w0 + 0.3)
  const dashoffset = useTransform(smooth, [w0, w1], [1, 0])
  const bloom = useTransform(smooth, [0.94, 1], [0, 1])

  return (
    <g>
      <motion.path
        d={stem.d}
        fill="none"
        stroke="var(--color-moss)"
        strokeWidth={0.012}
        strokeLinecap="round"
        opacity={0.8}
        pathLength={1}
        strokeDasharray="1"
        style={reduced ? { strokeDashoffset: 0 } : { strokeDashoffset: dashoffset }}
      />
      {stem.leaves.map((leaf, i) => (
        <GardenLeaf key={i} leaf={leaf} smooth={smooth} window={[w0, w1]} reduced={reduced} />
      ))}
      {last && (
        <motion.circle
          cx={stem.tip.x}
          cy={stem.tip.y}
          r={0.024}
          fill="var(--color-ember)"
          style={
            reduced
              ? { opacity: 0.9 }
              : { opacity: bloom, scale: bloom, transformOrigin: `${stem.tip.x}px ${stem.tip.y}px` }
          }
        />
      )}
    </g>
  )
}

export default function ReadingGarden({ seed }: { seed: string }) {
  const [wide, setWide] = useState(false)
  const holderRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    articleRef.current = holderRef.current?.closest('article') ?? null
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { smooth, reduced } = useReadingProgress(articleRef)
  const garden = useMemo(() => stems(seededRng(seed), STEM_COUNT), [seed])

  return (
    <div ref={holderRef} aria-hidden>
      {wide && (
        <svg
          viewBox="0 0 1 1"
          className="reading-garden"
          style={{
            position: 'fixed',
            left: 'calc(var(--u) * 3)',
            bottom: 0,
            width: 190,
            height: 190,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {garden.map((stem, i) => (
            <GardenStem
              key={i}
              stem={stem}
              index={i}
              smooth={smooth}
              reduced={reduced}
              last={i === garden.length - 1}
            />
          ))}
        </svg>
      )}
    </div>
  )
}
