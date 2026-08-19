import Link from 'next/link'
import { site, githubUrl } from '@/lib/site'

export default function Footer() {
  return (
    <footer
      className="mx-auto flex w-full max-w-[1280px] flex-wrap items-baseline justify-between gap-4 border-t"
      style={{
        borderColor: 'var(--color-line)',
        padding: 'calc(var(--u) * 4) calc(var(--u) * 3) calc(var(--u) * 6)',
        marginTop: 'calc(var(--u) * 10)',
      }}
    >
      <p className="urdu" lang="ur" dir="rtl" style={{ fontSize: 15, color: 'var(--color-fg-soft)' }}>
        {site.ghazalUr}
      </p>
      <nav className="mono-label flex gap-6" aria-label="Footer">
        <Link href="/about" className="transition-colors hover:text-(--color-fg)">About</Link>
        <Link href="/now" className="transition-colors hover:text-(--color-fg)">Now</Link>
        <Link href="/archive" className="transition-colors hover:text-(--color-fg)">Archive</Link>
        <Link href="/colophon" className="transition-colors hover:text-(--color-fg)">Colophon</Link>
        <Link href="/guide" className="transition-colors hover:text-(--color-fg)">Guide</Link>
        <a href={githubUrl} className="transition-colors hover:text-(--color-fg)">GitHub</a>
        <a href="/feed.xml" className="transition-colors hover:text-(--color-fg)">RSS</a>
      </nav>
    </footer>
  )
}
