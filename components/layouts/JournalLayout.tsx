import PostBody from '@/components/unedited/PostBody'
import ReadingGarden from '@/components/generative/ReadingGarden'
import PostMeta from './PostMeta'
import { formatStamp, type Post } from '@/lib/posts'

/** A margin note to the rest of the site: date dominant, quieter palette. */
export default function JournalLayout({
  post,
  uneditedCode,
}: {
  post: Post
  uneditedCode?: string
}) {
  return (
    <article
      className="mx-auto w-full"
      style={{ maxWidth: 680, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}
    >
      <header style={{ marginBottom: 'calc(var(--u) * 5)', paddingLeft: 'calc(var(--u) * 3)' }}>
        <time
          dateTime={post.date}
          className="font-(family-name:--font-mono) block"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-fg-soft)', fontVariantNumeric: 'tabular-nums' }}
        >
          {formatStamp(post.date)}
        </time>
        <h1 className="display italic" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', color: 'var(--color-fg)', marginTop: 'var(--u)' }}>
          {post.title}
        </h1>
      </header>
      <div style={{ paddingLeft: 'calc(var(--u) * 3)', borderLeft: '1px solid var(--color-line)' }}>
        <PostBody
          className="prose journal-body post-body"
          code={post.code}
          uneditedCode={uneditedCode}
        />
      </div>
      <PostMeta entry={post} />
      <ReadingGarden seed={post.slug} />
    </article>
  )
}
