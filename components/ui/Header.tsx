'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

/**
 * Minimal header (VISION.md Part 8): site name + palette trigger. No nav
 * links — the command palette and the feed ARE the navigation. Compresses
 * to a thin bar on scroll.
 */
export default function Header() {
  const [compressed, setCompressed] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompressed(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between border-b transition-all duration-300"
      style={{
        paddingInline: 'calc(var(--u) * 3)',
        paddingBlock: compressed ? 'var(--u)' : 'calc(var(--u) * 2)',
        borderColor: compressed ? 'var(--color-void-line)' : 'transparent',
        background: compressed
          ? 'color-mix(in srgb, var(--color-void) 88%, transparent)'
          : 'transparent',
        backdropFilter: compressed ? 'blur(12px)' : 'none',
        transitionTimingFunction: 'var(--ease)',
      }}
    >
      <Link
        href="/"
        className="display transition-colors"
        style={{ fontSize: compressed ? 18 : 22, fontStyle: 'italic' }}
      >
        {site.name}
      </Link>
      <button
        type="button"
        aria-label="Open command palette"
        onClick={() => window.dispatchEvent(new CustomEvent('palette:open'))}
        className="mono-label cursor-pointer rounded border px-2 py-1 transition-colors hover:text-(--color-bone)"
        style={{ borderColor: 'var(--color-void-line)' }}
      >
        ⌘K
      </button>
    </header>
  )
}
