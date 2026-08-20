import Link from 'next/link'
import CoverArt from '@/components/generative/CoverArt'
import DeskScreen from './DeskScreen'
import { ENTRY_TYPES, formatDate } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import type { Shipping } from '@/lib/github'

/**
 * The fallback: reduced motion, narrow viewports, and no-JS all land here.
 * Direct single-tap links with the excerpt already inline — no two-step
 * preview, since the "disambiguate a small scattered target" problem it
 * solves doesn't exist in a plain vertical list. Needs no client-side
 * logic of its own.
 */
export default function WallGrid({ posts, shipping }: { posts: Post[]; shipping: Shipping | null }) {
  return (
    <div>
      <div style={{ maxWidth: 320, height: 108, marginBottom: 'calc(var(--u) * 4)' }}>
        <DeskScreen shipping={shipping} />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'calc(var(--u) * 2)' }}>
        {posts.map((post) => {
          const meta = ENTRY_TYPES[post.type]
          return (
            <li key={post.slug}>
              <Link href={post.permalink} className="panel flex h-full flex-col" style={{ overflow: 'hidden' }}>
                <CoverArt seed={post.slug} type={post.type} height={140} />
                <div style={{ padding: 'calc(var(--u) * 2)' }}>
                  <p className="mono-label" style={{ fontSize: 9, color: 'var(--color-accent)' }}>
                    {meta.glyph} {meta.label} · {formatDate(post.date)}
                  </p>
                  <h3 className="display" style={{ fontSize: 17, marginTop: 4 }}>
                    {post.title}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{ fontSize: 12.5, color: 'var(--color-fg-soft)', marginTop: 6, lineHeight: 1.5 }}
                  >
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <Link
        href="/archive"
        className="mono-label transition-colors hover:text-(--color-fg)"
        style={{ display: 'inline-block', marginTop: 'calc(var(--u) * 4)', fontSize: 11 }}
      >
        browse the archive →
      </Link>
    </div>
  )
}
