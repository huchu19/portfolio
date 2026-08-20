'use client'

import { useEffect, useState } from 'react'
import DeskFigure, { SCREEN_RECT_SEATED, SCREEN_RECT_STANDING } from './DeskFigure'
import DeskScreen from './DeskScreen'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { seededRng } from '@/lib/generative'
import type { Shipping } from '@/lib/github'

/**
 * The standing desk's height changes: the figure alternates seated and
 * standing on a slow timer, and the screen rides along with it rather than
 * cutting between two fixed positions. Reduced motion picks one pose,
 * seeded by the date so it still varies visit to visit, and never moves.
 */

const POSE_INTERVAL_MS = 20_000

type Pose = 'seated' | 'standing'

function datePose(): Pose {
  return seededRng(new Date().toISOString().slice(0, 10))() > 0.5 ? 'standing' : 'seated'
}

export default function DeskFigureScene({ shipping }: { shipping: Shipping | null }) {
  const reduced = usePrefersReducedMotion()
  const [pose, setPose] = useState<Pose>(datePose)

  useEffect(() => {
    if (reduced) return
    const tick = setInterval(() => {
      if (document.hidden) return
      setPose((p) => (p === 'seated' ? 'standing' : 'seated'))
    }, POSE_INTERVAL_MS)
    return () => clearInterval(tick)
  }, [reduced])

  const rect = pose === 'seated' ? SCREEN_RECT_SEATED : SCREEN_RECT_STANDING
  const poseTransition = reduced ? 'none' : 'opacity 1s var(--ease)'
  const rectTransition = reduced
    ? 'none'
    : 'left 1s var(--ease), top 1s var(--ease), width 1s var(--ease), height 1s var(--ease)'

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: pose === 'seated' ? 1 : 0, transition: poseTransition }}>
        <DeskFigure pose="seated" />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: pose === 'standing' ? 1 : 0, transition: poseTransition }}>
        <DeskFigure pose="standing" />
      </div>
      <div
        style={{
          position: 'absolute',
          overflow: 'hidden',
          left: `${rect.xPct}%`,
          top: `${rect.yPct}%`,
          width: `${rect.wPct}%`,
          height: `${rect.hPct}%`,
          transition: rectTransition,
        }}
      >
        <DeskScreen shipping={shipping} />
      </div>
    </div>
  )
}
