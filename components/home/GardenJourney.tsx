'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

function useScrollProgress<T extends HTMLElement>(variable: string) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    let frame = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.max(0, Math.min(1, -rect.top / distance))
      section.style.setProperty(variable, progress.toFixed(4))
      frame = 0
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [variable])

  return ref
}

export function GardenThreshold() {
  const ref = useScrollProgress<HTMLElement>('--garden-progress')

  return (
    <section ref={ref} className="garden-threshold" aria-label="Leaving the studio for the project garden">
      <div className="garden-threshold-sticky">
        <div className="threshold-sky" aria-hidden><i /><i /><i /></div>
        <div className="threshold-stars" aria-hidden />
        <div className="threshold-horizon" aria-hidden />
        <div className="threshold-garden" aria-hidden>
          <div className="threshold-path" />
          <div className="threshold-tree threshold-tree--left"><i /><i /><i /></div>
          <div className="threshold-tree threshold-tree--right"><i /><i /><i /></div>
        </div>

        <div className="threshold-wall threshold-wall--left" aria-hidden><i /></div>
        <div className="threshold-wall threshold-wall--right" aria-hidden><i /></div>

        <p className="threshold-copy threshold-copy--leave">
          <small>Inside the studio</small>
          <strong>The work starts at the desk.</strong>
          <span>Keep scrolling to step outside.</span>
        </p>
        <p className="threshold-copy threshold-copy--arrive">
          <small>Khwabon ka Bagh · خوابوں کا باغ</small>
          <strong>The projects grow out here.</strong>
          <span>Follow the path through the garden.</span>
        </p>
        <span className="threshold-scroll-cue" aria-hidden>Push open the doors ↓</span>
      </div>
    </section>
  )
}

const CONSTELLATIONS = [
  { left: '13%', top: '19%', animationDelay: '-1.2s' },
  { left: '72%', top: '14%', animationDelay: '-3.8s' },
  { left: '53%', top: '38%', animationDelay: '-2.4s' },
] as const

export function SkyAscent() {
  const ref = useScrollProgress<HTMLElement>('--ascent-progress')

  return (
    <section ref={ref} className="sky-ascent" aria-labelledby="sky-ascent-title">
      <div className="sky-ascent-sticky">
        <div className="ascent-sky" aria-hidden />
        <div className="ascent-stars" aria-hidden />
        <div className="ascent-sun" aria-hidden />
        <div className="ascent-clouds" aria-hidden><i /><i /><i /></div>
        <div className="ascent-constellations" aria-hidden>
          {CONSTELLATIONS.map((style, index) => (
            <i key={style.left} className={`ascent-constellation ascent-constellation--${index + 1}`} style={style as CSSProperties}>
              <b /><b /><b /><b /><b />
            </i>
          ))}
        </div>
        <div className="ascent-land" aria-hidden>
          <i /><i /><i /><i /><i />
        </div>

        <div className="ascent-copy ascent-copy--garden">
          <span>02 · The garden</span>
          <h2 id="sky-ascent-title">Built on the ground.<br />Aimed elsewhere.</h2>
        </div>
        <div className="ascent-copy ascent-copy--sky">
          <span>03 · Open sky</span>
          <h2>There are always<br />more stars to reach.</h2>
          <p>Even in daylight, they are still there.</p>
        </div>

        <ol className="journey-marker" aria-label="Homepage journey">
          <li>Studio</li>
          <li>Garden</li>
          <li aria-current="step">Sky</li>
        </ol>
      </div>
    </section>
  )
}
