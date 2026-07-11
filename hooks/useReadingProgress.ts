'use client'

import type { RefObject } from 'react'
import { useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * One smoothed progress value per read — the site's scroll heartbeat.
 * 0 when the target's top meets the viewport top, 1 when its bottom
 * meets the viewport bottom, damped through a spring so consumers
 * (route arcs, garden stems, the zoom stage) move like they're being
 * breathed on rather than dragged.
 *
 * Under reduced motion consumers should ignore the MotionValues and
 * render their completed state — the `reduced` flag is returned so
 * they don't each re-derive it.
 */
export function useReadingProgress(target: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  })
  return { raw: scrollYProgress, smooth, reduced }
}
