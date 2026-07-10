import type { Post } from '@/lib/posts'
import { entryNumber, formatDate } from '@/lib/posts'
import MDXContent from '@/components/MDXContent'
import RouteStrip from '@/components/RouteStrip'
import styles from './AdventureLayout.module.css'

/**
 * Adventure — a flight log. Route strip that draws itself under the
 * title, mile-marker section numbering, optional cover image.
 */
export default function AdventureLayout({ post }: { post: Post }) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-14 md:pt-20">
      <header className="mb-12">
        <p className="meta-mono flex flex-wrap items-baseline gap-x-3">
          <span className="entry-no normal-case tracking-normal">
            № {entryNumber(post)}
          </span>
          <span>⁂ Adventure</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </p>
        <h1
          className="mt-5 font-display text-[clamp(2.4rem,5.5vw,3.6rem)] leading-[1.06] tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {post.title}
        </h1>

        {post.route && post.route.length > 1 && (
          <div className="mt-8 max-w-md">
            <RouteStrip route={post.route} />
          </div>
        )}

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="mt-10 w-full rounded-sm border border-line"
          />
        )}
      </header>

      <div className={`prose-fn ${styles.body}`}>
        <MDXContent code={post.code} />
      </div>

      <p className="meta-mono mt-16 border-t border-line pt-4 text-ink-faint">
        Logged · {post.route ? post.route.join(' → ') : formatDate(post.date)}
      </p>
    </article>
  )
}
