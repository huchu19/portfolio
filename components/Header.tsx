'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const NAV = [
  { href: '/', label: 'Feed' },
  { href: '/archive', label: 'Archive' },
  { href: '/about', label: 'About' },
  { href: '/now', label: 'Now' },
]

export default function Header() {
  const path = usePathname()

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-5">
        <Link
          href="/"
          className="font-display text-lg italic tracking-tight text-ink"
          style={{ fontVariationSettings: '"opsz" 40, "SOFT" 40' }}
        >
          Hussain Naqvi<span className="text-accent">.</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-baseline gap-x-5 gap-y-1"
        >
          {NAV.map((item) => {
            const active =
              item.href === '/' ? path === '/' : path.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`meta-mono transition-colors duration-300 ease-soft hover:text-ink ${
                  active ? 'text-ink' : ''
                }`}
              >
                {active && (
                  <span aria-hidden="true" className="text-accent">
                    ·{' '}
                  </span>
                )}
                {item.label}
              </Link>
            )
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
