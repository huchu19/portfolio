'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { WallLayoutItem } from '@/lib/wall'
import type { Shipping } from '@/lib/github'
import WallGrid from './WallGrid'
import ScatteredWall from './ScatteredWall'

/**
 * Owns the one piece of shared state (which preview is open — only one,
 * ever) and the ways to close it: Escape, clicking outside, or focus
 * leaving the scene entirely. Renders both fallback and scattered layouts
 * unconditionally and switches which is visible with plain CSS, so there's
 * no pre-hydration flash of the wrong one and the page works with zero JS.
 */
export default function WallScene({
  layout,
  shipping,
}: {
  layout: WallLayoutItem[]
  shipping: Shipping | null
}) {
  const reduced = usePrefersReducedMotion()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openSlug) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSlug(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSlug(null)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openSlug])

  return (
    <div
      ref={containerRef}
      onBlur={(e) => {
        if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
          setOpenSlug(null)
        }
      }}
    >
      <div className={reduced ? 'block' : 'md:hidden'}>
        <WallGrid posts={layout.map((l) => l.post)} shipping={shipping} />
      </div>
      <div className={reduced ? 'hidden' : 'hidden md:block'}>
        <ScatteredWall
          layout={layout}
          shipping={shipping}
          openSlug={openSlug}
          onOpen={setOpenSlug}
          onClose={() => setOpenSlug(null)}
        />
      </div>
    </div>
  )
}
