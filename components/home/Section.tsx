'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * The arrival gesture, once per section. REVAMP.md bans scroll-jacking and
 * parallax, so a section's only motion is showing up: it rises and fades in
 * the first time it crosses into view, then stays put.
 *
 * Reduced motion renders the resting state directly — same DOM, no transition.
 * The hook is ours, not framer's: framer's useReducedMotion has reported false
 * on route chunks where matchMedia said reduce, and the reduced-motion contract
 * here is screenshot-verified.
 */
export default function Section({
  id,
  label,
  className,
  style,
  children,
}: {
  id?: string
  /** names the section for screen readers and the skip order */
  label?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.section
      id={id}
      aria-label={label}
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
