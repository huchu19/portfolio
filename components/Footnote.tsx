'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Footnote.module.css'

/**
 * A print footnote. On wide screens inside a `.has-margin-notes` layout the
 * body floats into the outer gutter beside its reference (Tufte-style, pure
 * CSS — float + clear prevents collisions). On narrow screens the superscript
 * becomes a toggle that opens the note inline, like a correction slip.
 */
export default function Footnote({
  n,
  children,
}: {
  n: number
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [margin, setMargin] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !el.closest('.has-margin-notes')) return
    const mq = window.matchMedia('(min-width: 1280px)')
    const update = () => setMargin(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const noteId = `fn-${n}`

  return (
    <span ref={ref}>
      {margin ? (
        <sup className={styles.supStatic}>{n}</sup>
      ) : (
        <button
          type="button"
          className={styles.ref}
          aria-expanded={open}
          aria-controls={noteId}
          aria-label={`Footnote ${n}`}
          onClick={() => setOpen((v) => !v)}
        >
          <sup>{n}</sup>
        </button>
      )}
      <span
        id={noteId}
        role="note"
        className={styles.body}
        data-open={open ? 'true' : undefined}
      >
        <span className={styles.num} aria-hidden="true">
          {n}
        </span>
        {children}
      </span>
    </span>
  )
}
