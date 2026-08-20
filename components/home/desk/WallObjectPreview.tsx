'use client'

import Link from 'next/link'
import { ENTRY_TYPES, formatDate } from '@/lib/posts'
import type { WallLayoutItem } from '@/lib/wall'

/**
 * The in-scene preview. Anchored near its trigger, flipped toward the
 * center of the wall zone near an edge so it never overflows the scene.
 * A separate, always-live "Read →" link — not just "click the trigger
 * again" — because that second step needs to be discoverable, not just
 * technically possible.
 */
export default function WallObjectPreview({
  item,
  onClose,
}: {
  item: WallLayoutItem
  onClose: () => void
}) {
  const { post, xPct, yPct } = item
  const meta = ENTRY_TYPES[post.type]
  const alignRight = xPct > 60
  const alignBottom = yPct > 22

  return (
    <div
      role="group"
      aria-label={`Preview: ${post.title}`}
      className="panel"
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: `translate(${alignRight ? 'calc(-100% - 12px)' : '12px'}, ${
          alignBottom ? 'calc(-100% - 12px)' : '12px'
        })`,
        width: 240,
        padding: 'calc(var(--u) * 2)',
        zIndex: 20,
        background: 'var(--color-surface)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          lineHeight: 1,
          color: 'var(--color-fg-faint)',
        }}
      >
        ✕
      </button>

      <p className="mono-label" style={{ fontSize: 9, color: 'var(--color-accent)' }}>
        {meta.glyph} {meta.label} · {formatDate(post.date)}
      </p>
      <h3 className="display" style={{ fontSize: 16, marginTop: 4, paddingRight: 16 }}>
        {post.title}
      </h3>
      <p
        className="line-clamp-3"
        style={{ fontSize: 12.5, color: 'var(--color-fg-soft)', marginTop: 8, lineHeight: 1.5 }}
      >
        {post.excerpt}
      </p>
      <Link
        href={post.permalink}
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ display: 'inline-block', marginTop: 12, fontSize: 10.5, color: 'var(--color-fg)' }}
      >
        Read →
      </Link>
    </div>
  )
}
