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
 *
 * `initial` only governs the very first mount, and the hook starts `reduced`
 * at false so server and client agree on that first frame — so the first
 * paint always sets opacity:0 via `initial`, even for a reduced-motion
 * visitor. Once the hook resolves true a render later, `initial` is no
 * longer consulted, and `whileInView` isn't either without a scroll event to
 * trigger it, so nothing ever tells framer to move off that opacity:0 — it
 * has to be actively animated back, not just left alone. `animate` does
 * that: unlike `initial`, framer keeps it live across re-renders.
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
      initial={{ opacity: 0, y: 24 }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
