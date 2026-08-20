'use client'

import { useEffect, useState } from 'react'
import GhazalLine from '@/components/golden/GhazalLine'
import { site } from '@/lib/site'

const GHAZAL_LINES = [
  'خوابوں کا یہ باغ جلتا بھی رہے تو کیا',
  'راکھ سے بھی ایک نیا انقلاب پیدا ہوتا ہے',
]

/**
 * The arrival. One full viewport, and the only place on the site where
 * Urdu speaks first — the ghazal is the reason to be here, so it keeps
 * its screen. Everything below it is the desk.
 *
 * The cue at the foot is the honest part: it promises there is more, which
 * the old zoom stage did not deliver on.
 */
export default function Masthead() {
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      aria-label="Introduction"
      className="relative flex flex-col justify-center"
      style={{
        minHeight: '100dvh',
        paddingBlock: 'calc(var(--u) * 10)',
      }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
        Documentation of a headspace
      </p>

      <h1
        className="display"
        style={{ fontSize: 'clamp(52px, 9vw, 128px)', lineHeight: 0.95 }}
      >
        Hussain
        <br />
        <em>Naqvi</em>
      </h1>

      <div style={{ marginTop: 'calc(var(--u) * 5)', maxWidth: 560 }}>
        <GhazalLine lines={GHAZAL_LINES} />
        <p
          style={{
            marginTop: 'calc(var(--u) * 2)',
            fontSize: 14,
            color: 'var(--color-fg-soft)',
            maxWidth: '44ch',
          }}
        >
          {site.ghazalEn}
        </p>
      </div>

      <p
        className="mono-label"
        style={{
          marginTop: 'calc(var(--u) * 6)',
          color: 'var(--color-fg)',
          fontSize: 13,
        }}
      >
        Software engineer<span style={{ color: 'var(--color-accent)' }}> · </span>
        Urdu poet<span style={{ color: 'var(--color-accent)' }}> · </span>
        Delusional optimist
      </p>

      {/* the promise that scrolling is worth something */}
      <div
        aria-hidden
        className="mono-label absolute flex items-center"
        style={{
          bottom: 'calc(var(--u) * 4)',
          left: 0,
          gap: 'var(--u)',
          fontSize: 10.5,
          color: 'var(--color-fg-faint)',
          opacity: moved ? 0 : 1,
          transition: 'opacity 0.4s var(--ease)',
        }}
      >
        <span>↓</span>
        <span>the desk</span>
      </div>
    </section>
  )
}
