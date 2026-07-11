'use client'

import { useEffect, useRef } from 'react'

/**
 * Geometric cursor ring — construction-line energy, not wet-ink energy.
 * Hidden on touch devices and under prefers-reduced-motion (CSS handles both).
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let x = -100
    let y = -100

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      const interactive = (e.target as Element | null)?.closest(
        'a, button, [role="button"], input, textarea',
      )
      el.dataset.active = interactive ? 'true' : 'false'
      if (!raf && !document.hidden) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`
          raf = 0
        })
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-ring" aria-hidden />
}
