'use client'

import { useId, useState } from 'react'

/**
 * Footnotes: outer-gutter notes on wide screens, inline disclosure on
 * mobile (VISION essay brief). CSS in globals handles the two modes.
 */
export default function Footnote({
  n,
  children,
}: {
  n: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="footnote" data-open={open ? 'true' : 'false'}>
      <sup className="footnote-marker">
        <button
          type="button"
          data-feedback="off"
          aria-label={`${open ? 'Close' : 'Open'} footnote ${n}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {n}
        </button>
      </sup>
      <span id={id} className="footnote-body" role="note" aria-hidden={!open}>
        <span className="footnote-n">{n} — </span>
        {children}
      </span>
    </span>
  )
}
