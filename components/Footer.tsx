import Link from 'next/link'
import TermHint from '@/components/TermHint'
import { githubUrl, site } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="rule mt-24">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-10">
        <p
          className="font-display italic text-ink-soft"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}
        >
          Field notes from code, cities, and the in-between.
        </p>
        <p className="meta-mono flex gap-4">
          <a
            href={githubUrl}
            className="transition-colors duration-300 ease-soft hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={`mailto:${site.email}`}
            className="transition-colors duration-300 ease-soft hover:text-ink"
          >
            Email
          </a>
          <Link
            href="/colophon"
            className="transition-colors duration-300 ease-soft hover:text-ink"
          >
            Colophon
          </Link>
          <a
            href="/feed.xml"
            className="transition-colors duration-300 ease-soft hover:text-ink"
          >
            RSS
          </a>
          <TermHint />
        </p>
      </div>
    </footer>
  )
}
