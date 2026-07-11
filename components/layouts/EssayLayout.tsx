import MDXContent from '@/components/MDXContent'
import PostMeta from './PostMeta'
import { formatDate, type Post } from '@/lib/posts'

/** Big display headline; 66ch measure; gutter footnotes on wide screens. */
export default function EssayLayout({ post }: { post: Post }) {
  return (
    <article className="mx-auto w-full" style={{ maxWidth: 720, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}>
      <header style={{ marginBottom: 'calc(var(--u) * 6)' }}>
        <div className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
          Essay · <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
          {Math.max(1, Math.round(post.metadata.readingTime))} min
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', lineHeight: 1.05 }}>
          {post.title}
        </h1>
      </header>
      <div className="prose essay-body post-body">
        <MDXContent code={post.code} />
      </div>
      <PostMeta entry={post} />
    </article>
  )
}
