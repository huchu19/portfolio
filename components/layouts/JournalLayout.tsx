import type { Post } from '@/lib/posts'
import { formatStamp } from '@/lib/posts'
import MDXContent from '@/components/MDXContent'
import DebossStamp from '@/components/DebossStamp'

/**
 * Journal — a notebook page. Deeper paper, faint ruled lines, and the
 * date pressed into the sheet as a debossed rubber stamp: the date is
 * the heading device, the title follows it.
 */
export default function JournalLayout({ post }: { post: Post }) {
  return (
    <article className="relative bg-paper-deep">
      {/* dog-eared corner — someone means to come back to this page */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 h-12 w-12"
        style={{
          background:
            'linear-gradient(225deg, var(--color-paper) 0%, var(--color-paper) 50%, color-mix(in srgb, var(--color-ink) 14%, var(--color-paper-deep)) 50%, var(--color-paper-deep) 82%)',
          filter: 'drop-shadow(-2px 2px 2px rgb(32 27 20 / 0.12))',
        }}
      />
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14 md:pt-20">
        <header className="mb-12">
          <DebossStamp text={formatStamp(post.date)} />
          <h1
            className="mt-8 font-display text-3xl leading-snug md:text-4xl"
            style={{ fontVariationSettings: '"opsz" 100, "SOFT" 45' }}
          >
            {post.title}
          </h1>
          <p className="meta-mono mt-3 text-ink-faint">
            ¶ a page from the notebook
          </p>
        </header>

        <div
          className="prose-fn max-w-[58ch]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, transparent 0px, transparent calc(1.7 * 1.0625rem - 1px), color-mix(in srgb, var(--color-ink) 5%, transparent) calc(1.7 * 1.0625rem - 1px), color-mix(in srgb, var(--color-ink) 5%, transparent) calc(1.7 * 1.0625rem))',
          }}
        >
          <MDXContent code={post.code} />
        </div>

        <p
          className="mt-14 text-right font-display text-2xl italic text-ink-soft"
          style={{ fontVariationSettings: '"opsz" 30, "SOFT" 70' }}
          aria-hidden="true"
        >
          — H.
        </p>
      </div>
    </article>
  )
}
