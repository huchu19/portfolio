'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import ThemeToggle from './ThemeToggle'
import SignatureLogo from './SignatureLogo'

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
      className="site-header sticky top-0 z-50 flex items-center justify-between border-b transition-all duration-300"
      style={{
        paddingInline: 'calc(var(--u) * 3)',
        paddingBlock: compressed ? 'var(--u)' : 'calc(var(--u) * 2)',
        borderColor: compressed ? 'var(--color-line)' : 'transparent',
        transitionTimingFunction: 'var(--ease)',
      }}
    >
      <div className="site-mark flex min-w-0 flex-col" style={{ gap: 2 }}>
        {/* a small easter egg: the name remembers its mother tongue on hover */}
        <Link
          href="/"
          data-tactile
          data-magnetic
          aria-label={`${site.name} — home`}
          className="site-mark-link transition-colors"
          style={{ fontSize: compressed ? 18 : 22, fontStyle: urduName || urduPinned ? 'normal' : 'italic' }}
          onMouseEnter={() => setUrduName(true)}
          onMouseLeave={() => setUrduName(false)}
        >
          {urduName || urduPinned ? (
            <span lang="ur" dir="rtl" className="urdu" style={{ fontSize: '0.85em' }}>
              حسین نقوی
            </span>
          ) : (
            <SignatureLogo className={compressed ? 'site-signature is-compressed' : 'site-signature'} />
          )}
        </Link>
        {status && !compressed && (
          <span className="header-status truncate">
            {status}
          </span>
        )}
      </div>
      <div className="header-actions flex items-center" style={{ gap: 'var(--u)' }}>
        <nav className="header-nav" aria-label="Primary navigation">
          <Link href="/about" data-tactile data-magnetic>About</Link>
          <Link href="/#projects" data-tactile data-magnetic>Projects</Link>
          <Link href="/blog" data-tactile data-magnetic>Blog</Link>
          <Link href="/#contact" data-tactile data-magnetic>Contact</Link>
        </nav>
        <ThemeToggle />
        <button
          type="button"
          data-magnetic
          data-feedback="strong"
          aria-label="Open command palette"
          onClick={() => window.dispatchEvent(new CustomEvent('palette:open'))}
          className="command-trigger cursor-pointer border px-2 py-1 transition-colors hover:text-(--color-fg)"
          style={{ borderColor: 'var(--color-line)' }}
        >
          ⌘K
        </button>
      </div>
    </header>
  )
}
