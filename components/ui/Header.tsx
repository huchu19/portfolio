'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import ThemeToggle from './ThemeToggle'
import UneditedToggle from '@/components/unedited/UneditedToggle'

/**
 * Minimal header (VISION.md Part 8): site name + palette trigger. No nav
 * links — the command palette and the feed ARE the navigation. Compresses
 * to a thin bar on scroll.
 */
export default function Header({ status }: { status?: string | null }) {
  const [compressed, setCompressed] = useState(false)
  const [urduName, setUrduName] = useState(false)
  const [urduPinned, setUrduPinned] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompressed(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // >urdu in the palette pins the name to its mother tongue
    const onPin = () => setUrduPinned((p) => !p)
    window.addEventListener('egg:urdu', onPin)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('egg:urdu', onPin)
    }
  }, [])

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between border-b transition-all duration-300"
      style={{
        paddingInline: 'calc(var(--u) * 3)',
        paddingBlock: compressed ? 'var(--u)' : 'calc(var(--u) * 2)',
        borderColor: compressed ? 'var(--color-line)' : 'transparent',
        background: compressed
          ? 'color-mix(in srgb, var(--color-bg) 88%, transparent)'
          : 'transparent',
        backdropFilter: compressed ? 'blur(12px)' : 'none',
        transitionTimingFunction: 'var(--ease)',
      }}
    >
      <div className="flex min-w-0 flex-col" style={{ gap: 2 }}>
        {/* a small easter egg: the name remembers its mother tongue on hover */}
        <Link
          href="/"
          className="display transition-colors"
          style={{ fontSize: compressed ? 18 : 22, fontStyle: urduName || urduPinned ? 'normal' : 'italic' }}
          onMouseEnter={() => setUrduName(true)}
          onMouseLeave={() => setUrduName(false)}
        >
          {urduName || urduPinned ? (
            <span lang="ur" dir="rtl" className="urdu" style={{ fontSize: '0.85em' }}>
              حسین نقوی
            </span>
          ) : (
            site.name
          )}
        </Link>
        {/* the desk reporting on itself — teal, because it is true right now */}
        {status && !compressed && (
          <span
            className="mono-label truncate"
            style={{ fontSize: 10.5, color: 'var(--color-signal)', textTransform: 'none', letterSpacing: '0.06em' }}
          >
            {status}
          </span>
        )}
      </div>
      <div className="flex items-center" style={{ gap: 'var(--u)' }}>
        <UneditedToggle />
        <ThemeToggle />
        <button
          type="button"
          aria-label="Open command palette"
          onClick={() => window.dispatchEvent(new CustomEvent('palette:open'))}
          className="mono-label cursor-pointer rounded border px-2 py-1 transition-colors hover:text-(--color-fg)"
          style={{ borderColor: 'var(--color-line)' }}
        >
          ⌘K
        </button>
      </div>
    </header>
  )
}
