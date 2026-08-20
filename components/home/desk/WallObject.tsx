'use client'

import Link from 'next/link'
import CoverArt from '@/components/generative/CoverArt'
import { ENTRY_TYPES, formatDate } from '@/lib/posts'
import type { WallLayoutItem } from '@/lib/wall'
import WallObjectPreview from './WallObjectPreview'

/**
 * A real <Link>, not a <button> or an SVG-nested anchor — keeps
 * middle-click/cmd-click working and gets a normal, consistent focus ring,
 * neither of which SVG anchors reliably support. First activation opens
 * the preview instead of navigating; activating the same trigger again
 * (already open) navigates for real, no JS routing trick required.
 */
export default function WallObject({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: WallLayoutItem
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const { post, xPct, yPct, rotationDeg, scale } = item
  const meta = ENTRY_TYPES[post.type]

  return (
    <>
      <Link
        href={post.permalink}
        aria-label={`${post.title} — ${meta.label}, ${formatDate(post.date)}`}
        aria-expanded={isOpen}
        onMouseEnter={onOpen}
        onFocus={onOpen}
        onClick={(e) => {
          if (!isOpen) {
            e.preventDefault()
            onOpen()
          }
        }}
        style={{
          position: 'absolute',
          left: `${xPct}%`,
          top: `${yPct}%`,
          width: 120,
          transform: `translate(-50%, -50%) rotate(${rotationDeg.toFixed(1)}deg) scale(${scale.toFixed(2)})`,
          zIndex: isOpen ? 15 : 10,
        }}
      >
        <div style={{ position: 'relative' }}>
          <CoverArt seed={post.slug} type={post.type} height={64} />
          <span
            aria-hidden
            className="mono-label"
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 11,
              lineHeight: 1,
              color: 'var(--color-accent)',
              background: 'var(--color-bg)',
              borderRadius: 4,
              padding: '2px 4px',
            }}
          >
            {meta.glyph}
          </span>
        </div>
      </Link>
      {isOpen && <WallObjectPreview item={item} onClose={onClose} />}
    </>
  )
}
