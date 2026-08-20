'use client'

import Link from 'next/link'
import WallBackdrop from './WallBackdrop'
import DeskFigureScene from './DeskFigureScene'
import WallObject from './WallObject'
import type { WallLayoutItem } from '@/lib/wall'
import type { Shipping } from '@/lib/github'

/**
 * Wide-viewport, motion-ok rendering: the wall backdrop, the desk figure
 * and its screen, and every post floating as a real, clickable object —
 * all sharing one 1600×900 coordinate space so the wall objects, the
 * figure, and the backdrop's construction lines line up exactly.
 */
export default function ScatteredWall({
  layout,
  shipping,
  openSlug,
  onOpen,
  onClose,
}: {
  layout: WallLayoutItem[]
  shipping: Shipping | null
  openSlug: string | null
  onOpen: (slug: string) => void
  onClose: () => void
}) {
  return (
    <div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
        <WallBackdrop />
        <DeskFigureScene shipping={shipping} />
        {layout.map((item) => (
          <WallObject
            key={item.post.slug}
            item={item}
            isOpen={openSlug === item.post.slug}
            onOpen={() => onOpen(item.post.slug)}
            onClose={onClose}
          />
        ))}
      </div>
      <Link
        href="/archive"
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ display: 'inline-block', marginTop: 'calc(var(--u) * 3)', fontSize: 11 }}
      >
        or browse the archive →
      </Link>
    </div>
  )
}
