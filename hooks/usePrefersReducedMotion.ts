'use client'

import { useEffect, useState } from 'react'

/**
 * Reads prefers-reduced-motion straight from matchMedia. Framer's
 * useReducedMotion proved unreliable across route chunks (it reported
 * false on post pages while matchMedia said true), and the site's
 * reduced-motion contract is screenshot-verified — so the source of
 * truth is the media query itself. Starts false so server and first
 * client render agree; flips in an effect.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}
