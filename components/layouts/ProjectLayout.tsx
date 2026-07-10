import type { Post } from '@/lib/posts'
import { entryNumber, formatDate } from '@/lib/posts'
import MDXContent from '@/components/MDXContent'

/**
 * Project — a build dossier. Mono spec table with tabular figures,
 * stamped Live/Repo buttons, denser measure, story-first body.
 */
export default function ProjectLayout({ post }: { post: Post }) {
  const specs: [string, string][] = [
    ['Stack', post.tags.map((t) => t.toUpperCase()).join(' · ') || '—'],
    ['Year', post.date.slice(0, 4)],
    ['Status', 'Shipped'],
    ['Read', `${Math.ceil(post.metadata.readingTime)} min`],
  ]

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-14 md:pt-20">
      <header className="mb-12">
        <p className="meta-mono flex flex-wrap items-baseline gap-x-3">
          <span className="entry-no normal-case tracking-normal">
            № {entryNumber(post)}
          </span>
          <span>⌗ Project dossier</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </p>

        <div className="mt-5 gap-x-12 lg:grid lg:grid-cols-[1fr_260px]">
          <div>
            <h1
              className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.06] tracking-tight"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              {post.title}
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              {post.excerpt}
            </p>

            {post.projectLinks && (
              <p className="mt-8 flex flex-wrap gap-3">
                {post.projectLinks.live && (
                  <a
                    href={post.projectLinks.live}
                    className="meta-mono border border-ink px-4 py-2 text-ink transition-colors duration-300 ease-soft hover:bg-ink hover:text-paper"
                  >
                    Live site <span className="text-accent">↗</span>
                  </a>
                )}
                {post.projectLinks.repo && (
                  <a
                    href={post.projectLinks.repo}
                    className="meta-mono border border-line px-4 py-2 transition-colors duration-300 ease-soft hover:border-ink hover:text-ink"
                  >
                    Repository ↗
                  </a>
                )}
              </p>
            )}
          </div>

          <dl className="mt-10 h-fit border-t-2 border-ink lg:mt-2">
            {specs.map(([term, value]) => (
              <div
                key={term}
                className="flex items-baseline justify-between gap-4 border-b border-line py-3"
              >
                <dt className="meta-mono text-ink-faint">{term}</dt>
                <dd className="meta-mono text-right text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="prose-fn text-[1rem]">
        <MDXContent code={post.code} />
      </div>

      <p className="meta-mono mt-16 border-t border-line pt-4 text-ink-faint">
        End of dossier · № {entryNumber(post)}
      </p>
    </article>
  )
}
