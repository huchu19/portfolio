import type { Post } from '@/lib/posts'
import { entryNumber, formatDate } from '@/lib/posts'
import MDXContent from '@/components/MDXContent'
import styles from './EssayLayout.module.css'

/**
 * Essay — a print feature torn from a serious review. 66ch measure,
 * justified with hyphens on desktop, margin footnotes in the outer
 * gutter on wide screens (see Footnote.module.css), drop cap, end mark.
 */
export default function EssayLayout({ post }: { post: Post }) {
  return (
    <article className="has-margin-notes">
      <div className="mx-auto max-w-[70ch] px-6 pb-24 pt-14 md:pt-20">
        <header className="mb-12">
          <p className="meta-mono flex flex-wrap items-baseline gap-x-3">
            <span className="entry-no normal-case tracking-normal">
              № {entryNumber(post)}
            </span>
            <span>§ Essay</span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{Math.ceil(post.metadata.readingTime)} min read</span>
          </p>
          <h1
            className="mt-5 font-display text-[clamp(2.4rem,5.5vw,3.6rem)] leading-[1.06] tracking-tight"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            {post.title}
          </h1>
          <p
            className="mt-5 max-w-[52ch] font-display text-lg italic leading-relaxed text-ink-soft"
            style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}
          >
            {post.excerpt}
          </p>
          <div
            aria-hidden="true"
            className="mt-8 border-b border-t border-line pb-[3px]"
          >
            <div className="border-b border-line pb-[2px]" />
          </div>
        </header>

        <div className={`prose-fn ${styles.body}`}>
          <MDXContent code={post.code} />
        </div>

        <p className={styles.endmark} aria-hidden="true">
          ❧
        </p>
      </div>
    </article>
  )
}
