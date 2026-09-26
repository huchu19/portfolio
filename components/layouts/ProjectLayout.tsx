import CoverArt from '@/components/generative/CoverArt'
import RepoFactsTable from './RepoFactsTable'
import PostMeta from './PostMeta'
import { formatDate } from '@/lib/posts'
import type { Project } from '@/lib/projects'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live: { label: 'Live', color: 'var(--color-accent)' },
  'in-progress': { label: 'In Progress', color: 'var(--color-accent-bright)' },
  archived: { label: 'Archived', color: 'var(--color-fg-soft)' },
}

/**
 * Dense dossier energy: title, stack chips, status badge, live/repo links.
 * Everything below the header is the repo's README, as GitHub renders it.
 */
export default function ProjectLayout({ project: post }: { project: Project }) {
  const status = STATUS_LABEL[post.status]
  return (
    <article className="project-document mx-auto w-full" style={{ maxWidth: 880, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 8)' }}>
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
        <h1 className="display" style={{ fontSize: 'clamp(32px, 4.4vw, 48px)' }}>{post.title}</h1>
        {post.stack.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 'var(--u)', marginTop: 'calc(var(--u) * 3)' }}>
            {post.stack.map((s) => (
              <span
                key={s}
                className="project-stack-label mono-label"
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
        <div className="flex flex-wrap" style={{ gap: 'calc(var(--u) * 2)', marginTop: 'calc(var(--u) * 3)' }}>
            {post.links.live && (
              <a
                href={post.links.live}
                rel="noopener"
                data-external-paper
                data-tactile
                className="project-action mono-label transition-colors hover:text-(--color-bg)"
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
            <a
              href={post.links.repo}
              rel="noopener"
              data-external-paper
              data-tactile
              className="project-action mono-label transition-colors hover:text-(--color-fg)"
              style={{ padding: 'var(--u) calc(var(--u) * 2)', border: '1px solid var(--color-line)', borderRadius: 4 }}
            >
              Repository ↗
            </a>
        </div>
      </header>
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={`${post.title} — screenshot`}
          className="project-cover w-full"
          style={{ marginBottom: 'calc(var(--u) * 5)', border: '1px solid var(--color-line)' }}
        />
      ) : (
        <CoverArt seed={post.slug} type={post.type} height={240} className="cover-art-block" />
      )}
      <RepoFactsTable facts={post.facts} />
      {post.html ? (
        <div className="prose post-body readme-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      ) : (
        <p className="prose post-body">
          This repository has no README yet — <a href={post.links.repo}>see it on GitHub</a>.
        </p>
      )}
      <PostMeta entry={post} />
    </article>
  )
}
