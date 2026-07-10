'use client'

import { createElement, useEffect, useRef } from 'react'

type Props = {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'span' | 'div'
  baseWght?: number
  maxWght?: number
  wonk?: 0 | 1
  /** letters occasionally scatter with physics and reassemble (UNSAID) */
  scatter?: boolean
}

const RADIUS = 150 // px of cursor influence
const G = 1500 // px/s² — gravity during the scatter
const OUT = 0.6 // s of ballistic flight
const BACK = 0.9 // s of reassembly

/**
 * Per-letter cursor proximity drives Fraunces variable axes (wght + SOFT).
 * One rAF loop, lerped; idle when the cursor is far, off entirely for
 * reduced-motion and coarse pointers.
 */
export default function KineticTitle({
  text,
  className,
  as = 'span',
  baseWght = 360,
  maxWght = 640,
  wonk = 0,
  scatter = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  /* the scatter: a moment of disorder, then everything back in its place */
  useEffect(() => {
    const el = ref.current
    if (!el || !scatter) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-k]'))
    if (letters.length === 0) return

    let raf = 0
    let seeds: { vx: number; vy: number; vr: number }[] | null = null
    let t0 = 0

    const easeInOut = (p: number) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2

    const step = (now: number) => {
      const t = (now - t0) / 1000
      if (!seeds) return
      if (t >= OUT + BACK || document.hidden) {
        for (const span of letters) span.style.transform = ''
        seeds = null
        return
      }
      const tb = Math.min(t, OUT)
      const k = t <= OUT ? 1 : 1 - easeInOut((t - OUT) / BACK)
      for (let i = 0; i < letters.length; i++) {
        const s = seeds[i]
        const x = s.vx * tb * k
        const y = (s.vy * tb + 0.5 * G * tb * tb) * k
        const r = s.vr * tb * k
        letters[i].style.transform =
          `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(1)}deg)`
      }
      raf = requestAnimationFrame(step)
    }

    const trigger = () => {
      if (seeds || document.hidden) return
      seeds = letters.map(() => ({
        vx: (Math.random() - 0.5) * 680,
        vy: -(180 + Math.random() * 440),
        vr: (Math.random() - 0.5) * 560,
      }))
      t0 = performance.now()
      raf = requestAnimationFrame(step)
    }

    const first = window.setTimeout(trigger, 3200)
    const ambient = window.setInterval(trigger, 26000)
    el.addEventListener('click', trigger)

    return () => {
      window.clearTimeout(first)
      window.clearInterval(ambient)
      el.removeEventListener('click', trigger)
      cancelAnimationFrame(raf)
      for (const span of letters) span.style.transform = ''
    }
  }, [scatter])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-k]'))
    const state = letters.map(() => ({ w: baseWght, s: 0 }))
    let mx = -1e4
    let my = -1e4
    let raf = 0
    let running = false

    const frame = () => {
      raf = 0
      let live = false
      for (let i = 0; i < letters.length; i++) {
        const span = letters[i]
        const r = span.getBoundingClientRect()
        const d = Math.hypot(
          r.left + r.width / 2 - mx,
          r.top + r.height / 2 - my,
        )
        const t = Math.max(0, 1 - d / RADIUS)
        const tw = baseWght + (maxWght - baseWght) * t * t
        const ts = 100 * t * t
        const st = state[i]
        st.w += (tw - st.w) * 0.16
        st.s += (ts - st.s) * 0.16
        if (Math.abs(tw - st.w) > 0.4 || Math.abs(ts - st.s) > 0.4) live = true
        span.style.fontVariationSettings = `"opsz" 144, "wght" ${st.w.toFixed(1)}, "SOFT" ${st.s.toFixed(1)}, "WONK" ${wonk}`
      }
      if (live && !document.hidden) {
        raf = requestAnimationFrame(frame)
      } else {
        running = false
      }
    }

    const kick = () => {
      if (!running && !document.hidden) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      kick()
    }
    const onLeave = () => {
      mx = -1e4
      my = -1e4
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', onLeave)
    document.addEventListener('visibilitychange', kick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', onLeave)
      document.removeEventListener('visibilitychange', kick)
    }
  }, [baseWght, maxWght, wonk])

  return createElement(
    as,
    { ref, className, 'aria-label': text },
    Array.from(text).map((ch, i) =>
      ch === ' ' ? (
        <span key={i}> </span>
      ) : (
        <span
          key={i}
          data-k
          aria-hidden="true"
          className="inline-block"
          style={{
            fontVariationSettings: `"opsz" 144, "wght" ${baseWght}, "SOFT" 0, "WONK" ${wonk}`,
          }}
        >
          {ch}
        </span>
      ),
    ),
  )
}
