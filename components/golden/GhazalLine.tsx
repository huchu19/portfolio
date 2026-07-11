'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Rotating ghazal lines in Nastaliq — the universe's epigraph, breathing. */
export default function GhazalLine({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || lines.length < 2) return
    const tick = setInterval(() => {
      if (document.hidden) return
      setVisible(false)
      setTimeout(() => {
        setI((n) => (n + 1) % lines.length)
        setVisible(true)
      }, 500)
    }, 7000)
    return () => clearInterval(tick)
  }, [reduced, lines.length])

  return (
    <p
      lang="ur"
      dir="rtl"
      className="urdu"
      style={{
        fontSize: 'clamp(20px, 2.2vw, 28px)',
        color: 'var(--color-bone)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s var(--ease)',
        minHeight: '2.4em',
      }}
    >
      {lines[i]}
    </p>
  )
}
