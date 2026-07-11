import MDXContent from '@/components/MDXContent'
import PostMeta from './PostMeta'
import { formatDate, type Post } from '@/lib/posts'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live: { label: 'Live', color: 'var(--color-ember)' },
  'in-progress': { label: 'In Progress', color: 'var(--color-ember-bright)' },
  archived: { label: 'Archived', color: 'var(--color-ash)' },
}

/** Dense dossier energy: title, stack chips, status badge, live/repo links. */
export default function ProjectLayout({ post }: { post: Post }) {
  const status = post.status ? STATUS_LABEL[post.status] : undefined
  return (
    <article className="mx-auto w-full" style={{ maxWidth: 760, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 8)' }}>
      <header style={{ marginBottom: 'calc(var(--u) * 6)', borderBottom: '1px solid var(--color-void-line)', paddingBottom: 'calc(var(--u) * 4)' }}>
        <div className="mono-label flex flex-wrap items-center gap-x-4 gap-y-2" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
          <span style={{ color: 'var(--color-ember)' }}>Project</span>
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
                  border: '1px solid var(--color-void-line)',
                  borderRadius: 4,
                  background: 'var(--color-void-raised)',
                  color: 'var(--color-bone)',
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
                className="mono-label transition-colors hover:text-(--color-void)"
                style={{
                  padding: 'var(--u) calc(var(--u) * 2)',
                  border: '1px solid var(--color-ember-deep)',
                  borderRadius: 4,
                  color: 'var(--color-ember-bright)',
                }}
              >
                Live ↗
              </a>
            )}
            {post.projectLinks.repo && (
              <a
                href={post.projectLinks.repo}
                rel="noopener"
                className="mono-label transition-colors hover:text-(--color-bone)"
                style={{ padding: 'var(--u) calc(var(--u) * 2)', border: '1px solid var(--color-void-line)', borderRadius: 4 }}
              >
                Repository ↗
              </a>
            )}
          </div>
        )}
      </header>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={`${post.title} — screenshot`}
          className="w-full rounded-lg"
          style={{ marginBottom: 'calc(var(--u) * 5)', border: '1px solid var(--color-void-line)' }}
        />
      )}
      <div className="prose post-body">
        <MDXContent code={post.code} />
      </div>
      <PostMeta entry={post} />
    </article>
  )
}
