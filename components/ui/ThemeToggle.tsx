'use client'

import { useEffect, useRef, useState } from 'react'
import { emitFeedback } from '@/lib/feedback'

type Theme = 'daylight' | 'night'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme, animate = true) {
  document.documentElement.dataset.theme = theme
  if (animate) document.documentElement.dataset.themeTurning = 'true'
  document.documentElement.style.removeProperty('background-color')
  document.body.style.removeProperty('background-color')
  document.body.style.removeProperty('color')
  if (animate) window.setTimeout(() => delete document.documentElement.dataset.themeTurning, 720)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('daylight')
  const themeRef = useRef<Theme>('daylight')

  const commitTheme = (value: Theme, withFeedback = false) => {
    if (withFeedback) emitFeedback('strong')
    themeRef.current = value
    applyTheme(value)
    window.localStorage.setItem(STORAGE_KEY, value)
    setTheme(value)
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const initial = saved === 'night' ? 'night' : 'daylight'
    applyTheme(initial, false)
    themeRef.current = initial
    setTheme(initial)
  }, [])

  useEffect(() => {
    const toggle = () => {
      const value: Theme = themeRef.current === 'daylight' ? 'night' : 'daylight'
      commitTheme(value, true)
    }
    window.addEventListener('studio:toggle-theme', toggle)
    return () => window.removeEventListener('studio:toggle-theme', toggle)
  }, [])

  const next = theme === 'daylight' ? 'night' : 'daylight'

  return (
    <button
      type="button"
      data-magnetic
      data-feedback="strong"
      className="theme-toggle cursor-pointer"
      aria-label={`Turn the studio lights ${next === 'night' ? 'down' : 'up'}`}
      title={`${next === 'night' ? 'Night' : 'Day'} studio`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 'calc(var(--u) * 4)',
        height: 'calc(var(--u) * 4)',
      }}
      onClick={() => {
        commitTheme(next)
      }}
    />
  )
}
