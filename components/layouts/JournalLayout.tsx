import MDXContent from '@/components/MDXContent'
import PostMeta from './PostMeta'
import { formatStamp, type Post } from '@/lib/posts'

/** A margin note to the rest of the site: date dominant, quieter palette. */
export default function JournalLayout({ post }: { post: Post }) {
  return (
    <article
      className="mx-auto w-full"
      style={{ maxWidth: 680, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}
    >
      <header style={{ marginBottom: 'calc(var(--u) * 5)', paddingLeft: 'calc(var(--u) * 3)' }}>
        <time
          dateTime={post.date}
          className="font-(family-name:--font-mono) block"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-ash)', fontVariantNumeric: 'tabular-nums' }}
        >
          {formatStamp(post.date)}
        </time>
        <h1 className="display italic" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', color: 'var(--color-bone)', marginTop: 'var(--u)' }}>
          {post.title}
        </h1>
      </header>
      <div
        className="prose journal-body post-body"
        style={{ paddingLeft: 'calc(var(--u) * 3)', borderLeft: '1px solid var(--color-void-line)' }}
      >
        <MDXContent code={post.code} />
      </div>
      <PostMeta entry={post} />
    </article>
  )
}
