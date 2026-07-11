'use client'

import { useEffect, useRef } from 'react'

/**
 * Mobile fallback for the persistent spiral (VISION Part 2/12): a thin
 * ember progress line on the right edge showing where you are.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      if (document.hidden) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      el.style.transform = `scaleY(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed top-0 bottom-0 z-40 md:hidden"
      style={{ right: 0, width: 2, background: 'var(--color-void-line)' }}
    >
      <div
        ref={ref}
        className="h-full w-full origin-top"
        style={{ background: 'var(--color-ember)', transform: 'scaleY(0)' }}
      />
    </div>
  )
}
