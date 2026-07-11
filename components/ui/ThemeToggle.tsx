'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  const paint =
    theme === 'light'
      ? { background: '#f5f0e8', color: '#2a231d' }
      : { background: '#0c0a08', color: '#e8dfd0' }
  document.documentElement.style.backgroundColor = paint.background
  document.body.style.backgroundColor = paint.background
  document.body.style.color = paint.color
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const initial = saved === 'light' || saved === 'dark' ? saved : 'dark'
    applyTheme(initial)
    setTheme(initial)
  }, [])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle cursor-pointer"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 'calc(var(--u) * 4)',
        height: 'calc(var(--u) * 4)',
      }}
      onClick={() => {
        applyTheme(next)
        window.localStorage.setItem(STORAGE_KEY, next)
        setTheme(next)
      }}
    />
  )
}
