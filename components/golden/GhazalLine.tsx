'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Rotating ghazal lines in Nastaliq — the universe's epigraph,
 * breathing. Each line now arrives kinetically: word by word in
 * reading order (bidi puts the first word rightmost), rising out of a
 * blur like ink settling. Words are the finest safe split — Nastaliq
 * shaping and ligatures live *within* words, so never split glyphs —
 * and nothing is masked with overflow, which would clip the script's
 * deep vertical envelope. Reduced motion keeps the old opacity swap.
 */

const line = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const word = {
  hidden: { opacity: 0, y: 6, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function GhazalLine({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (lines.length < 2) return
    const tick = setInterval(() => {
      if (document.hidden) return
      if (reduced) {
        // the old, quiet behavior: plain opacity swap
        setVisible(false)
        setTimeout(() => {
          setI((n) => (n + 1) % lines.length)
          setVisible(true)
        }, 500)
      } else {
        setI((n) => (n + 1) % lines.length)
      }
    }, 7000)
    return () => clearInterval(tick)
  }, [reduced, lines.length])

  const style = {
    fontSize: 'clamp(20px, 2.2vw, 28px)',
    color: 'var(--color-bone)',
    minHeight: '2.4em',
  } as const

  if (reduced) {
    return (
      <p
        lang="ur"
        dir="rtl"
        className="urdu"
        style={{ ...style, opacity: visible ? 1 : 0, transition: 'opacity 0.5s var(--ease)' }}
      >
        {lines[i]}
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={i}
        lang="ur"
        dir="rtl"
        className="urdu"
        style={style}
        variants={line}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {lines[i].split(/\s+/).map((w, j) => (
          <motion.span
            key={j}
            variants={word}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {w}
            {' '}
          </motion.span>
        ))}
      </motion.p>
    </AnimatePresence>
  )
}
