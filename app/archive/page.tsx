import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getPostsGroupedByYear,
  getAllPosts,
  entryNumber,
  formatStamp,
  POST_TYPES,
} from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'The printed index — every entry ever published, year by year, numbered like a ledger.',
}

export default function ArchivePage() {
  const years = getPostsGroupedByYear()
  const total = getAllPosts().length

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <header className="mb-16">
        <p className="meta-mono mb-4">The printed index</p>
        <h1
          className="font-display text-5xl leading-none tracking-tight md:text-6xl"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Archive<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-ink-soft">
          Every entry, in order of appearance — {total} so far, numbered like a
          ledger. № 01 is the oldest; the top of this page is the newest.
        </p>
      </header>

      {years.map(([year, posts]) => (
        <section key={year} className="mb-16" aria-labelledby={`y-${year}`}>
          <div className="flex items-baseline gap-6">
            <h2
              id={`y-${year}`}
              className="font-display text-6xl font-light tracking-tight text-ink md:text-7xl"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              {year}
            </h2>
            <span className="meta-mono text-ink-faint">
              {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
            </span>
            <span className="rule mb-3 flex-1 self-end" aria-hidden="true" />
          </div>

          <ol className="mt-6">
            {posts.map((post) => (
              <li key={post.slug} className="rule">
                <Link
                  href={post.permalink}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 md:grid-cols-[11ch_2ch_1fr_auto] md:gap-x-6"
                >
                  <span className="meta-mono order-1 transition-colors duration-300 ease-soft group-hover:text-ink md:order-none">
                    {formatStamp(post.date)}
                  </span>
                  <span
                    className="order-3 text-center text-ink-faint transition-colors duration-300 ease-soft group-hover:text-accent-deep md:order-none"
                    title={POST_TYPES[post.type].label}
                    aria-hidden="true"
                  >
                    {POST_TYPES[post.type].glyph}
                  </span>
                  <span className="sr-only">{POST_TYPES[post.type].label}</span>
                  <span
                    className="order-4 col-span-2 font-display text-xl leading-snug transition-[transform,color] duration-300 ease-soft group-hover:translate-x-2 group-hover:text-accent-deep md:order-none md:col-span-1 md:text-2xl"
                    style={{ fontVariationSettings: '"opsz" 60' }}
                  >
                    {post.title}
                  </span>
                  <span className="entry-no order-2 text-right text-lg md:order-none">
                    № {entryNumber(post)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="rule pt-8 text-center font-display italic text-ink-faint">
        fin — for now
      </p>
    </div>
  )
}
