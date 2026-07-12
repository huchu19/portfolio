'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { site } from '@/lib/site'

/**
 * The deliberate-complexity layer (fable-25's rule: earn a second
 * look). Three custom events — same pattern as `palette:open` — plus
 * one typed incantation:
 *
 *   egg:spiral  → the golden spiral redraws itself at full opacity
 *   egg:urdu    → pins the header's Nastaliq name (see Header.tsx)
 *   egg:dream   → six seconds of the dream state: construction lines
 *                 surface and a ghazal line floats over the void
 *
 * Typing "khwab" (dream) anywhere outside an input fires egg:dream.
 * Reduced motion: the dream is a still image — visible, not animated.
 */
export default function EasterEggs() {
  const [dreaming, setDreaming] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-5)
      if (buffer === 'khwab') {
        buffer = ''
        window.dispatchEvent(new CustomEvent('egg:dream'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    let spiralTimer: ReturnType<typeof setTimeout>
    let dreamTimer: ReturnType<typeof setTimeout>
    const onSpiral = () => {
      // remove-then-add restarts the CSS draw animation
      document.body.removeAttribute('data-egg-spiral')
      requestAnimationFrame(() => document.body.setAttribute('data-egg-spiral', ''))
      clearTimeout(spiralTimer)
      spiralTimer = setTimeout(() => document.body.removeAttribute('data-egg-spiral'), 4200)
    }
    const onDream = () => {
      document.body.setAttribute('data-dream', '')
      setDreaming(true)
      clearTimeout(dreamTimer)
      dreamTimer = setTimeout(() => {
        document.body.removeAttribute('data-dream')
        setDreaming(false)
      }, 6000)
    }
    window.addEventListener('egg:spiral', onSpiral)
    window.addEventListener('egg:dream', onDream)
    return () => {
      window.removeEventListener('egg:spiral', onSpiral)
      window.removeEventListener('egg:dream', onDream)
      clearTimeout(spiralTimer)
      clearTimeout(dreamTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {dreaming && (
        <motion.div
          className="dream-overlay fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 90, pointerEvents: 'none' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0, transition: { duration: 1 } }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            lang="ur"
            dir="rtl"
            className="urdu"
            style={{
              fontSize: 'clamp(24px, 4vw, 44px)',
              color: 'var(--color-bone)',
              textShadow: '0 0 48px color-mix(in srgb, var(--color-ember) 55%, transparent)',
              padding: 'calc(var(--u) * 3)',
              textAlign: 'center',
            }}
          >
            {site.ghazalUr}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
