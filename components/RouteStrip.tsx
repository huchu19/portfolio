'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A flight-log route: mono airport chips joined by a line that draws
 * itself when the strip enters the viewport. Fully drawn from the start
 * under prefers-reduced-motion.
 */
export default function RouteStrip({ route }: { route: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex items-center gap-2"
      role="list"
      aria-label={`Route: ${route.join(' to ')}`}
    >
      {route.map((stop, i) => (
        <span key={`${stop}-${i}`} className="contents">
          {i > 0 && (
            <svg
              viewBox="0 0 100 24"
              preserveAspectRatio="none"
              className="h-6 min-w-8 flex-1 text-ink-faint"
              aria-hidden="true"
            >
              <path
                d="M2 16 C 30 6, 70 20, 98 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                pathLength={100}
                strokeDasharray={100}
                style={{
                  strokeDashoffset: drawn ? 0 : 100,
                  transition: `stroke-dashoffset 1.1s var(--ease) ${(i - 1) * 0.45}s`,
                }}
              />
              <circle
                cx="98"
                cy="10"
                r="2.5"
                fill="currentColor"
                style={{
                  opacity: drawn ? 1 : 0,
                  transition: `opacity 0.3s var(--ease) ${(i - 1) * 0.45 + 0.9}s`,
                }}
              />
            </svg>
          )}
          <span
            role="listitem"
            className="meta-mono rounded-sm border border-line px-3 py-1.5 text-ink"
          >
            {stop}
          </span>
        </span>
      ))}
    </div>
  )
}
