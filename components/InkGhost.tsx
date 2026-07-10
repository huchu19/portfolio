'use client'

import { useEffect, useRef } from 'react'

/**
 * A drop of wet ink that trails the pointer — additive, the native cursor
 * stays. Grows over links and buttons, squashes on press. One rAF loop
 * that idles when settled; never mounted for coarse pointers or
 * reduced-motion readers.
 */
export default function InkGhost() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      el.remove()
      return
    }

    let tx = -100
    let ty = -100
    let x = -100
    let y = -100
    let ts = 1 // target scale
    let s = 1
    let raf = 0

    const tick = () => {
      raf = 0
      if (document.hidden) return
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      s += (ts - s) * 0.2
      el.style.transform = `translate(${x - 5}px, ${y - 5}px) scale(${s.toFixed(3)})`
      if (
        Math.abs(tx - x) > 0.3 ||
        Math.abs(ty - y) > 0.3 ||
        Math.abs(ts - s) > 0.01
      ) {
        raf = requestAnimationFrame(tick)
      }
    }
    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      const hot = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"]',
      )
      ts = hot ? 2.4 : 1
      wake()
    }
    const onDown = () => {
      ts = 0.6
      wake()
    }
    const onUp = (e: PointerEvent) => {
      const hot = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"]',
      )
      ts = hot ? 2.4 : 1
      wake()
    }
    const onLeave = () => {
      tx = -100
      ty = -100
      wake()
    }
    const onVis = () => wake()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="ink-ghost"
      aria-hidden="true"
      style={{ transform: 'translate(-100px, -100px)' }}
    />
  )
}
