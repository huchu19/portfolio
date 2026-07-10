'use client'

import { useEffect, useRef } from 'react'

/**
 * Gentle scroll parallax — the masthead sits a layer above the stream,
 * like loose sheets on a desk. Off under reduced-motion.
 */
export default function Parallax({
  speed = -0.05,
  className,
  children,
}: {
  speed?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      el.style.transform = `translate3d(0, ${(window.scrollY * speed).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      el.style.transform = ''
    }
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
