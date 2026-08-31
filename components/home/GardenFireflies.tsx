'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

const FIREFLIES = [
  [8, 13, 0], [18, 31, 1.8], [29, 19, 3.1], [41, 38, 0.7],
  [55, 16, 2.3], [66, 34, 4.2], [78, 21, 1.1], [91, 42, 3.5],
  [14, 67, 4.8], [37, 74, 2.8], [62, 63, 0.4], [86, 79, 2.1],
] as const

const GROWTH = [
  [7, 12], [19, 27], [33, 44], [48, 63], [59, 78], [72, 91], [84, 58], [94, 34],
] as const

export default function GardenFireflies() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = ref.current
    const garden = layer?.closest<HTMLElement>('.garden-world')
    if (!layer || !garden) return
    let pointerFrame = 0
    let scrollFrame = 0
    const move = (event: PointerEvent) => {
      if (pointerFrame) return
      pointerFrame = requestAnimationFrame(() => {
        const rect = garden.getBoundingClientRect()
        layer.style.setProperty('--firefly-x', `${event.clientX - rect.left}px`)
        layer.style.setProperty('--firefly-y', `${event.clientY - rect.top}px`)
        pointerFrame = 0
      })
    }
    const updateDepth = () => {
      const rect = garden.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)))
      layer.style.setProperty('--garden-depth', progress.toFixed(4))
      scrollFrame = 0
    }
    const requestDepth = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateDepth)
    }
    updateDepth()
    garden.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', requestDepth, { passive: true })
    window.addEventListener('resize', requestDepth)
    return () => {
      garden.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', requestDepth)
      window.removeEventListener('resize', requestDepth)
      if (pointerFrame) cancelAnimationFrame(pointerFrame)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [])

  return (
    <div ref={ref} className="garden-population" aria-hidden>
      <div className="garden-fireflies">
        <i className="firefly-pointer-glow" />
        {FIREFLIES.map(([left, top, delay]) => (
          <i key={`${left}-${top}`} className="garden-firefly" style={{ left: `${left}%`, top: `${top}%`, animationDelay: `-${delay}s` }} />
        ))}
      </div>
      <div className="garden-depth-growth">
        {GROWTH.map(([left, top], index) => (
          <i key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, '--growth-index': index } as CSSProperties} />
        ))}
      </div>
    </div>
  )
}
