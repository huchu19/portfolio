'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * MURMUR — the poem read through fog. Every letter drifts on a slow
 * wind (layered sines, per-letter phase) and rests slightly ghosted;
 * the cursor is a lantern that stills and sharpens the words inside
 * its radius. One rAF loop, running only while the poem is on screen
 * and the tab visible. Reduced-motion or coarse pointers get the poem
 * still, at full ink — we never split, so the DOM text stays intact.
 */

const RADIUS = 130 // px — the lantern's reach
const REST = 0.58 // ghosted ink at rest
const WIND_X = 1.9 // px of horizontal drift
const WIND_Y = 2.5 // px of vertical drift
const LERP = 0.14

type L = {
  el: HTMLElement
  x: number
  y: number
  c: number // lantern glow 0..1 (lerped)
  p1: number // wind phases
  p2: number
  p3: number
}

export default function LanternPoem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return
    }

    // -- split text nodes into per-letter spans (idempotent for StrictMode)
    if (!root.dataset.lantern) {
      root.dataset.lantern = '1'
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []
      let n: Node | null
      while ((n = walker.nextNode())) {
        if (n.textContent && n.textContent.trim()) textNodes.push(n as Text)
      }
      for (const node of textNodes) {
        const frag = document.createDocumentFragment()
        for (const ch of node.textContent ?? '') {
          if (/\s/.test(ch)) {
            frag.appendChild(document.createTextNode(ch))
            continue
          }
          const s = document.createElement('span')
          s.textContent = ch
          s.dataset.ll = ''
          s.style.display = 'inline-block'
          s.style.opacity = String(REST)
          s.style.willChange = 'transform, opacity'
          frag.appendChild(s)
        }
        node.parentNode?.replaceChild(frag, node)
      }
    }

    const letters: L[] = Array.from(
      root.querySelectorAll<HTMLElement>('[data-ll]'),
    ).map((el, i) => ({
      el,
      x: 0,
      y: 0,
      c: 0,
      p1: i * 0.37 + Math.random() * 6.28,
      p2: i * 0.19 + Math.random() * 6.28,
      p3: Math.random() * 6.28,
    }))
    if (letters.length === 0) return

    // -- geometry cache (document coordinates)
    let dirty = true
    const measure = () => {
      const sx = window.scrollX
      const sy = window.scrollY
      for (const L of letters) {
        // measure the un-transformed spot
        const prev = L.el.style.transform
        L.el.style.transform = ''
        const r = L.el.getBoundingClientRect()
        L.el.style.transform = prev
        L.x = r.left + r.width / 2 + sx
        L.y = r.top + r.height / 2 + sy
      }
      dirty = false
    }

    let raf = 0
    let inView = false
    let cx = -1e5
    let cy = -1e5

    const tick = (now: number) => {
      raf = 0
      if (document.hidden || !inView) return
      if (dirty) measure()
      const t = now / 1000
      const mx = cx + window.scrollX
      const my = cy + window.scrollY
      for (const L of letters) {
        const d = Math.hypot(L.x - mx, L.y - my)
        const target = d >= RADIUS ? 0 : 1 - d / RADIUS
        L.c += (target - L.c) * LERP
        const calm = 1 - L.c // the lantern stills the wind
        const wx =
          (Math.sin(t * 0.55 + L.p1) * 0.6 + Math.sin(t * 1.3 + L.p2) * 0.4) *
          WIND_X *
          calm
        const wy =
          (Math.cos(t * 0.4 + L.p2) * 0.6 + Math.sin(t * 0.9 + L.p3) * 0.4) *
          WIND_Y *
          calm
        L.el.style.transform = `translate(${wx.toFixed(2)}px, ${wy.toFixed(2)}px)`
        L.el.style.opacity = (REST + (1 - REST) * L.c).toFixed(3)
      }
      raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf && !document.hidden && inView) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        wake()
      },
      { rootMargin: '10% 0px' },
    )
    io.observe(root)

    let remeasureT = 0
    const onMove = (e: PointerEvent) => {
      cx = e.clientX
      cy = e.clientY
      wake()
    }
    const onLeave = () => {
      cx = -1e5
      cy = -1e5
    }
    const onScroll = () => {
      window.clearTimeout(remeasureT)
      remeasureT = window.setTimeout(() => {
        dirty = true
      }, 160)
    }
    const onResize = () => {
      dirty = true
    }
    const onVis = () => wake()

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    document.fonts?.ready.then(() => {
      dirty = true
      wake()
    })
    // stanza reveals translate the verse on entry — settle geometry after
    const settleT = window.setTimeout(() => {
      dirty = true
      wake()
    }, 1800)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.clearTimeout(remeasureT)
      window.clearTimeout(settleT)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
