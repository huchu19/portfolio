'use client'

import { useEffect, useRef } from 'react'

/**
 * Poetry line reveal: each line develops like ink — opacity only, no
 * positional shift, staggered ~120ms (VISION motion language). Under
 * prefers-reduced-motion everything is visible immediately.
 */
export default function PoetryReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lines = Array.from(root.querySelectorAll<HTMLElement>('p, blockquote, h2, h3'))
    lines.forEach((el) => {
      el.style.opacity = '0'
      el.style.transition = 'opacity 1.1s var(--ease)'
    })

    let revealed = 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.style.transitionDelay = `${Math.min(revealed * 120, 600)}ms`
          el.style.opacity = '1'
          revealed++
          io.unobserve(el)
        }
      },
      { threshold: 0.3 },
    )
    lines.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return <div ref={ref}>{children}</div>
}
