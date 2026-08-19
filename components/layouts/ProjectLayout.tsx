import PostBody from '@/components/unedited/PostBody'
import CoverArt from '@/components/generative/CoverArt'
import ReadingGarden from '@/components/generative/ReadingGarden'
import RepoFactsTable from './RepoFactsTable'
import PostMeta from './PostMeta'
import { formatDate, type Post } from '@/lib/posts'
import type { RepoFacts } from '@/lib/github'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live: { label: 'Live', color: 'var(--color-accent)' },
  'in-progress': { label: 'In Progress', color: 'var(--color-accent-bright)' },
  archived: { label: 'Archived', color: 'var(--color-fg-soft)' },
}

/** Dense dossier energy: title, stack chips, status badge, live/repo links. */
export default function ProjectLayout({
  post,
  facts = null,
  uneditedCode,
}: {
  post: Post
  facts?: RepoFacts | null
  uneditedCode?: string
}) {
  const status = post.status ? STATUS_LABEL[post.status] : undefined
  return (
    <article className="mx-auto w-full" style={{ maxWidth: 760, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 8)' }}>
      <header style={{ marginBottom: 'calc(var(--u) * 6)', borderBottom: '1px solid var(--color-line)', paddingBottom: 'calc(var(--u) * 4)' }}>
        <div className="mono-label flex flex-wrap items-center gap-x-4 gap-y-2" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
          <span style={{ color: 'var(--color-accent)' }}>Project</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {status && (
            <span className="flex items-center gap-1.5" style={{ color: status.color }}>
              <span aria-hidden className="inline-block rounded-full" style={{ width: 6, height: 6, background: status.color }} />
              {status.label}
            </span>
          )}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}>{post.title}</h1>
        {post.stack && (
          <div className="flex flex-wrap" style={{ gap: 'var(--u)', marginTop: 'calc(var(--u) * 3)' }}>
            {post.stack.map((s) => (
              <span
                key={s}
                className="mono-label"
                style={{
                  fontSize: 11,
                  padding: '2px calc(var(--u) * 1.5)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 4,
                  background: 'var(--color-surface)',
                  color: 'var(--color-fg)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        {(post.projectLinks?.live || post.projectLinks?.repo) && (
          <div className="flex flex-wrap" style={{ gap: 'calc(var(--u) * 2)', marginTop: 'calc(var(--u) * 3)' }}>
            {post.projectLinks.live && (
              <a
                href={post.projectLinks.live}
                rel="noopener"
                className="mono-label transition-colors hover:text-(--color-bg)"
                style={{
                  padding: 'var(--u) calc(var(--u) * 2)',
                  border: '1px solid var(--color-accent-deep)',
                  borderRadius: 4,
                  color: 'var(--color-accent-bright)',
                }}
              >
                Live ↗
              </a>
            )}
            {post.projectLinks.repo && (
              <a
                href={post.projectLinks.repo}
                rel="noopener"
                className="mono-label transition-colors hover:text-(--color-fg)"
                style={{ padding: 'var(--u) calc(var(--u) * 2)', border: '1px solid var(--color-line)', borderRadius: 4 }}
              >
                Repository ↗
              </a>
            )}
          </div>
        )}
      </header>
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={`${post.title} — screenshot`}
          className="w-full rounded-lg"
          style={{ marginBottom: 'calc(var(--u) * 5)', border: '1px solid var(--color-line)' }}
        />
      ) : (
        <CoverArt seed={post.slug} type={post.type} height={240} className="cover-art-block" />
      )}
      <RepoFactsTable facts={facts} />
      <PostBody className="prose post-body" code={post.code} uneditedCode={uneditedCode} />
      <PostMeta entry={post} />
      <ReadingGarden seed={post.slug} />
    </article>
  )
}
