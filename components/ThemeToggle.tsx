'use client'

import { useEffect, useState } from 'react'

/**
 * Day / lamplight switch. The pre-paint script in layout.tsx applies the
 * stored theme before first render; this button just flips it.
 */
export default function ThemeToggle() {
  const [dusk, setDusk] = useState<boolean | null>(null)

  useEffect(() => {
    setDusk(document.documentElement.dataset.theme === 'dusk')
  }, [])

  const toggle = () => {
    const next = !dusk
    setDusk(next)
    if (next) {
      document.documentElement.dataset.theme = 'dusk'
    } else {
      delete document.documentElement.dataset.theme
    }
    try {
      localStorage.setItem('fn-theme', next ? 'dusk' : 'day')
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dusk ? 'Switch to daylight' : 'Switch to lamplight'}
      title={dusk ? 'Daylight' : 'Lamplight'}
      className="meta-mono -my-1 cursor-pointer border border-line px-2 py-1 transition-colors duration-300 ease-soft hover:border-ink hover:text-ink"
      suppressHydrationWarning
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {dusk === null ? '◐' : dusk ? '☀' : '☾'}
      </span>
    </button>
  )
}
