'use client'

import { useEffect, useRef, useState } from 'react'
import KineticTitle from '@/components/KineticTitle'

/**
 * The masthead as matter — "Field Notes." rebuilt every frame from
 * thousands of ink grains (GLYPH FOUNDRY lineage, hand-rolled 2D canvas).
 * Grains fly in and settle into the glyphs, carve open under the cursor,
 * heal when it leaves, and burst on click. Reduced-motion readers get the
 * kinetic DOM title instead; an invisible DOM copy always defines layout
 * and the accessible name.
 */

const SPRING = 0.032
const DAMP = 0.85
const CURSOR_R = 110
const CURSOR_F = 2.6

export default function InkHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [still, setStill] = useState<boolean | null>(null)

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (still !== false) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let alive = true
    let px = new Float32Array(0) // positions
    let py = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let hx = new Float32Array(0) // homes
    let hy = new Float32Array(0)
    let tiers: number[][] = [] // draw batches: [inkFaint, inkMid, inkFull, accent]
    let colors = ['', '', '', '']
    let sizes = new Float32Array(0)
    let dpr = 1
    let cx = -1e4
    let cy = -1e4
    let energy = 1 // sleep when settled

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      const ink = cs.getPropertyValue('--color-ink').trim()
      const accent = cs.getPropertyValue('--color-accent').trim()
      colors = [
        `color-mix(in srgb, ${ink} 55%, transparent)`,
        `color-mix(in srgb, ${ink} 78%, transparent)`,
        ink,
        accent,
      ]
    }

    const build = async () => {
      await document.fonts.ready
      if (!alive) return
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 10 || rect.height < 10) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)

      // --- sample the glyphs from an offscreen raster at CSS-pixel scale
      const off = document.createElement('canvas')
      off.width = Math.round(rect.width)
      off.height = Math.round(rect.height)
      const octx = off.getContext('2d')!
      const family = getComputedStyle(wrap).fontFamily
      // two lines, staggered like the DOM masthead; the period is accent
      const size = rect.height * 0.46
      octx.textBaseline = 'alphabetic'
      octx.font = `600 ${size}px ${family}`
      const y1 = size * 0.82
      const y2 = rect.height * 0.94
      const x2 = rect.width * 0.17
      octx.fillStyle = '#000'
      octx.fillText('Huchu', 0, y1)
      octx.fillText('Notes', x2, y2)
      const notesW = octx.measureText('Notes').width
      // the accent period, sampled in a second pass
      const inkData = octx.getImageData(0, 0, off.width, off.height).data
      octx.clearRect(0, 0, off.width, off.height)
      octx.font = `600 ${size}px ${family}`
      octx.fillText('.', x2 + notesW, y2)
      const dotData = octx.getImageData(0, 0, off.width, off.height).data

      const pts: { x: number; y: number; accent: boolean }[] = []
      const stride = 2
      for (let y = 0; y < off.height; y += stride) {
        for (let x = 0; x < off.width; x += stride) {
          const i = (y * off.width + x) * 4 + 3
          if (inkData[i] > 128) {
            pts.push({ x: x + Math.random() * 1.6, y: y + Math.random() * 1.6, accent: false })
          } else if (dotData[i] > 128) {
            pts.push({ x: x + Math.random() * 1.6, y: y + Math.random() * 1.6, accent: true })
          }
        }
      }
      if (pts.length === 0) return

      const budget = Math.min(
        pts.length,
        rect.width < 700 ? 3200 : 7500,
      )
      // shuffle, keep `budget`
      for (let i = pts.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0
        ;[pts[i], pts[j]] = [pts[j], pts[i]]
      }
      const n = budget
      px = new Float32Array(n)
      py = new Float32Array(n)
      vx = new Float32Array(n)
      vy = new Float32Array(n)
      hx = new Float32Array(n)
      hy = new Float32Array(n)
      sizes = new Float32Array(n)
      tiers = [[], [], [], []]
      for (let i = 0; i < n; i++) {
        const p = pts[i % pts.length]
        hx[i] = p.x
        hy[i] = p.y
        // grains pour in from all around the masthead
        const a = Math.random() * Math.PI * 2
        const r = Math.max(rect.width, rect.height) * (0.55 + Math.random() * 0.5)
        px[i] = rect.width / 2 + Math.cos(a) * r
        py[i] = rect.height / 2 + Math.sin(a) * r
        vx[i] = 0
        vy[i] = 0
        sizes[i] = 1.1 + Math.random() * 1.5
        tiers[p.accent ? 3 : (Math.random() * 3) | 0].push(i)
      }
      readColors()
      energy = 1
      wake()
    }

    const step = () => {
      raf = 0
      if (!alive || document.hidden) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      let moving = 0
      for (let i = 0; i < px.length; i++) {
        let ax = (hx[i] - px[i]) * SPRING
        let ay = (hy[i] - py[i]) * SPRING
        const dx = px[i] - cx
        const dy = py[i] - cy
        const d2 = dx * dx + dy * dy
        if (d2 < CURSOR_R * CURSOR_R && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = ((1 - d / CURSOR_R) * CURSOR_F) / d
          ax += dx * f
          ay += dy * f
        }
        vx[i] = (vx[i] + ax) * DAMP
        vy[i] = (vy[i] + ay) * DAMP
        px[i] += vx[i]
        py[i] += vy[i]
        const dhx = hx[i] - px[i]
        const dhy = hy[i] - py[i]
        const speed2 = vx[i] * vx[i] + vy[i] * vy[i]
        const dist2 = dhx * dhx + dhy * dhy
        if (speed2 < 0.02 && dist2 < 0.7) {
          // seat the grain — a letter must read crisply from a still frame
          px[i] = hx[i]
          py[i] = hy[i]
          vx[i] = 0
          vy[i] = 0
        } else {
          moving++
        }
      }
      energy = moving / Math.max(1, px.length)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (let t = 0; t < 4; t++) {
        ctx.fillStyle = colors[t]
        const list = tiers[t]
        for (let k = 0; k < list.length; k++) {
          const i = list[k]
          const s = sizes[i]
          ctx.fillRect(px[i] - s / 2, py[i] - s / 2, s, s)
        }
      }
      if (energy > 0.002) raf = requestAnimationFrame(step)
    }
    const wake = () => {
      if (!raf && alive && !document.hidden) raf = requestAnimationFrame(step)
    }

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      cx = e.clientX - r.left
      cy = e.clientY - r.top
    }
    const onMove = (e: PointerEvent) => {
      toLocal(e)
      wake()
    }
    const onLeaveWin = () => {
      cx = -1e4
      cy = -1e4
      wake()
    }
    const onDown = (e: PointerEvent) => {
      toLocal(e)
      // a burst — every grain near the press is thrown outward
      for (let i = 0; i < px.length; i++) {
        const dx = px[i] - cx
        const dy = py[i] - cy
        const d = Math.hypot(dx, dy) || 1
        if (d < 240) {
          const f = ((1 - d / 240) * 26) / d
          vx[i] += dx * f
          vy[i] += dy * f
        }
      }
      wake()
    }
    const onVis = () => wake()

    let resizeT = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeT)
      resizeT = window.setTimeout(build, 180)
    })
    ro.observe(wrap)
    const mo = new MutationObserver(() => {
      readColors()
      wake()
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', onLeaveWin)
    document.documentElement.addEventListener('mouseleave', onLeaveWin)
    canvas.addEventListener('pointerdown', onDown)
    document.addEventListener('visibilitychange', onVis)
    build()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeT)
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', onLeaveWin)
      document.documentElement.removeEventListener('mouseleave', onLeaveWin)
      canvas.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [still])

  /* reduced-motion (or pre-hydration): the kinetic DOM masthead */
  if (still !== false) {
    return (
      <h1
        aria-label="Huchu Notes"
        className="mt-10 font-display leading-[0.9] tracking-[-0.025em] text-[clamp(3.5rem,11.5vw,10rem)] md:mt-14"
      >
        <KineticTitle as="div" text="Huchu" baseWght={380} maxWght={680} scatter />
        <div className="ml-[12%] md:ml-[18%]">
          <KineticTitle as="span" text="Notes" baseWght={380} maxWght={680} wonk={1} scatter />
          <span aria-hidden="true" className="text-accent">
            .
          </span>
        </div>
      </h1>
    )
  }

  return (
    <div
      ref={wrapRef}
      role="heading"
      aria-level={1}
      aria-label="Huchu Notes"
      className="relative mt-10 font-display leading-[0.9] tracking-[-0.025em] text-[clamp(3.5rem,11.5vw,10rem)] md:mt-14"
    >
      {/* invisible twin defines the exact height the grains will fill */}
      <div aria-hidden="true" className="invisible select-none">
        <div>Huchu</div>
        <div className="ml-[12%] md:ml-[18%]">Notes.</div>
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full cursor-crosshair"
      />
    </div>
  )
}
