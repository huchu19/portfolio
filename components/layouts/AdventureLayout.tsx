import MDXContent from '@/components/MDXContent'
import CoverArt from '@/components/generative/CoverArt'
import PostMeta from './PostMeta'
import RouteArc from './RouteArc'
import { formatDate, type Post } from '@/lib/posts'

/** Route strip header, full-bleed cover support, travelogue body. */
export default function AdventureLayout({ post }: { post: Post }) {
  return (
    <article className="mx-auto w-full" style={{ maxWidth: 720, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 8)' }}>
      <header style={{ marginBottom: 'calc(var(--u) * 3)' }}>
        <div className="mono-label" style={{ marginBottom: 'calc(var(--u) * 3)', color: 'var(--color-wave)' }}>
          Adventure · <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', lineHeight: 1.1 }}>
          {post.title}
        </h1>
      </header>
      {/* direct child of the article so it can ride sticky through the read */}
      {post.route && post.route.length > 1 && <RouteArc route={post.route} />}
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="w-full rounded-lg"
          style={{ marginBottom: 'calc(var(--u) * 5)', border: '1px solid var(--color-void-line)' }}
        />
      ) : (
        <CoverArt seed={post.slug} type={post.type} height={200} className="cover-art-block" />
      )}
      <div className="prose post-body">
        <MDXContent code={post.code} />
      </div>
      <PostMeta entry={post} />
    </article>
  )
}
