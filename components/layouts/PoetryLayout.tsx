import MDXContent from '@/components/MDXContent'
import PostMeta from './PostMeta'
import PoetryReveal from './PoetryReveal'
import type { Post } from '@/lib/posts'

/**
 * The most artistically important layout. Maximum negative space —
 * the darkness IS the design; the poem is light emerging from void.
 * No metadata above the fold.
 */
export default function PoetryLayout({ post }: { post: Post }) {
  const urduOnly = post.lang === 'ur'
  return (
    <article
      className="mx-auto w-full"
      style={{
        maxWidth: 640,
        padding: 'calc(var(--u) * 3)',
        paddingTop: 'clamp(calc(var(--u) * 10), 18vh, calc(var(--u) * 24))',
        paddingBottom: 'calc(var(--u) * 16)',
      }}
    >
      <h1
        className="display italic"
        style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', marginBottom: 'calc(var(--u) * 10)', color: 'var(--color-ash)' }}
      >
        {post.title}
      </h1>
      <PoetryReveal>
        <div
          className={`poetry-body${urduOnly ? ' urdu' : ''}`}
          {...(urduOnly ? { lang: 'ur', dir: 'rtl' } : {})}
        >
          <MDXContent code={post.code} />
        </div>
      </PoetryReveal>
      <PostMeta entry={post} />
    </article>
  )
}
