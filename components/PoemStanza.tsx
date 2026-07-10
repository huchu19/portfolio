'use client'

import { useEffect, useRef, type ComponentProps } from 'react'

/**
 * A stanza that surfaces gently on scroll, using the shared `.reveal`
 * classes from globals.css (which already handle reduced-motion).
 * Stanzas that enter view in the same breath stagger themselves.
 */

let batchAt = 0
let batchN = 0
function staggerDelay(): number {
  const now = performance.now()
  if (now - batchAt > 450) batchN = 0
  batchAt = now
  return batchN++ * 160
}

export default function PoemStanza({
  className,
  ...props
}: ComponentProps<'p'>) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let t = 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          t = window.setTimeout(() => el.classList.add('in'), staggerDelay())
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])

  return <p ref={ref} className={`reveal ${className ?? ''}`} {...props} />
}
