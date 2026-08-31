import Link from 'next/link'
import { site, githubUrl } from '@/lib/site'
import EmailLink from '@/components/watcher/EmailLink'
import SignatureLogo from './SignatureLogo'

export default function Footer() {
  return (
    <footer
      className="site-footer mx-auto flex w-full max-w-[1280px] flex-wrap items-baseline justify-between gap-4 border-t"
      style={{
        borderColor: 'var(--color-line)',
        padding: 'calc(var(--u) * 4) calc(var(--u) * 3) calc(var(--u) * 6)',
        marginTop: 'calc(var(--u) * 10)',
      }}
    >
      <div className="flex flex-col" style={{ gap: 'var(--u)' }}>
        <Link href="/" aria-label={`${site.name} — home`} data-tactile className="footer-brand">
          <SignatureLogo className="footer-signature" />
        </Link>
      </div>
      <nav className="mono-label flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
        <Link href="/#projects" className="transition-colors hover:text-(--color-fg)">Projects</Link>
        <Link href="/blog" className="transition-colors hover:text-(--color-fg)">Blog</Link>
        <Link href="/#contact" className="transition-colors hover:text-(--color-fg)">Contact</Link>
        <a href={githubUrl} className="transition-colors hover:text-(--color-fg)">GitHub</a>
        <EmailLink email={site.email} />
      </nav>
    </footer>
  )
}
