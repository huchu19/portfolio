'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Rotating ghazal lines in Nastaliq — the universe's epigraph,
 * breathing. Each line arrives kinetically: word by word in reading
 * order (bidi puts the first word rightmost), rising out of a blur
 * like ink settling. Words are the finest safe split — Nastaliq
 * shaping and ligatures live *within* words, so never split glyphs —
 * and nothing is masked with overflow, which would clip the script's
 * deep vertical envelope.
 *
 * Reduced motion keeps the exact same DOM (word spans — anything else
 * would be a hydration mismatch, since the server can't know the
 * preference) and swaps the choreography for a plain cross-fade.
 */

const EASE = [0.22, 1, 0.36, 1] as const

export default function GhazalLine({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (lines.length < 2) return
    const tick = setInterval(() => {
      if (document.hidden) return
      setI((n) => (n + 1) % lines.length)
    }, 7000)
    return () => clearInterval(tick)
  }, [lines.length])

  const line = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09 } },
    exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.4, ease: EASE } },
  }
  const word = reduced
    ? {
        // still resolve filter/y: the first client render (before the
        // preference is known) may have applied the blurred hidden state
        hidden: { opacity: 0 },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, y: 6, filter: 'blur(6px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.7, ease: EASE },
        },
      }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={i}
        lang="ur"
        dir="rtl"
        className="urdu"
        style={{
          fontSize: 'clamp(20px, 2.2vw, 28px)',
          color: 'var(--color-fg)',
          minHeight: '2.4em',
        }}
        variants={line}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {lines[i].split(/\s+/).map((w, j) => (
          <motion.span key={j} variants={word} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {w}
            {' '}
          </motion.span>
        ))}
      </motion.p>
    </AnimatePresence>
  )
}
