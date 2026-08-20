'use client'

import { useEffect, useState } from 'react'

/**
 * `№ 04 / 12` riding the gutter — the counter advances as panels pass
 * reading height. REVAMP.md §4.2 calls this the tier-1 Watcher surface:
 * the site noticing, without addressing you.
 *
 * It is also the plainest possible proof that scrolling is getting you
 * somewhere, which is the whole point of the descent.
 */
export default function EntryLedger({ total }: { total: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (total === 0) return
    const panels = document.querySelectorAll<HTMLElement>('[data-entry-index]')
    if (panels.length === 0) return

    // -42% top margin puts the trigger line at reading height rather than
    // at the viewport edge, so the counter tracks what you're looking at.
    const seen = new Set<number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number(e.target.getAttribute('data-entry-index'))
          if (Number.isNaN(i)) continue
          if (e.isIntersecting) seen.add(i)
          else seen.delete(i)
        }
        if (seen.size > 0) setIndex(Math.min(...seen))
      },
      { rootMargin: '-42% 0px -42% 0px' },
    )

    for (const p of panels) io.observe(p)
    return () => io.disconnect()
  }, [total])

  if (total === 0) return null

  return (
    <div aria-hidden className="entry-ledger">
      <div
        className="mono-label"
        style={{
          position: 'sticky',
          top: '50dvh',
          fontSize: 10.5,
          color: 'var(--color-fg-faint)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: 'var(--color-accent)' }}>
          № {String(index + 1).padStart(2, '0')}
        </span>
        {' / '}
        {String(total).padStart(2, '0')}
      </div>
    </div>
  )
}
