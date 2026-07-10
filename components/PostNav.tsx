import Link from 'next/link'
import { getAllPosts, entryNumber, POST_TYPES, type Post } from '@/lib/posts'

/** Ledger navigation — every entry sits between its neighbours. */
export default function PostNav({ post }: { post: Post }) {
  const posts = getAllPosts() // newest first
  const i = posts.findIndex((p) => p.slug === post.slug)
  const newer = i > 0 ? posts[i - 1] : null
  const older = i < posts.length - 1 ? posts[i + 1] : null
  if (!newer && !older) return null

  return (
    <nav
      aria-label="Ledger navigation"
      className="rule mx-auto grid max-w-3xl gap-x-10 gap-y-8 px-6 py-12 sm:grid-cols-2"
    >
      <div className="group">
        {older && (
          <>
            <p className="meta-mono mb-2 text-ink-faint">
              ← Older · № {entryNumber(older)} ·{' '}
              {POST_TYPES[older.type].label}
            </p>
            <Link
              href={older.permalink}
              className="link-draw font-display text-xl leading-snug"
              style={{ fontVariationSettings: '"opsz" 60, "wght" 480' }}
            >
              {older.title}
            </Link>
          </>
        )}
      </div>
      <div className="group sm:text-right">
        {newer && (
          <>
            <p className="meta-mono mb-2 text-ink-faint">
              Newer · № {entryNumber(newer)} · {POST_TYPES[newer.type].label}{' '}
              →
            </p>
            <Link
              href={newer.permalink}
              className="link-draw font-display text-xl leading-snug"
              style={{ fontVariationSettings: '"opsz" 60, "wght" 480' }}
            >
              {newer.title}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
