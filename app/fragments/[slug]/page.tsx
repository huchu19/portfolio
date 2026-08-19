import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MDXContent from '@/components/MDXContent'
import AudioPlayer from '@/components/ui/AudioPlayer'
import { isAudioPath } from '@/lib/media'
import PostMeta from '@/components/layouts/PostMeta'
import { fragmentDot } from '@/components/feed/tagColors'
import { getAllFragments, getFragmentBySlug } from '@/lib/posts'

export function generateStaticParams() {
  return getAllFragments().map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const fragment = getFragmentBySlug(slug)
  if (!fragment) return {}
  const title = fragment.title ?? `Fragment · ${fragment.date.slice(0, 10)}`
  return { title, description: fragment.excerpt.slice(0, 160) }
}

/**
 * Fragment permalink — minimal: the fragment centered on the void,
 * prev/next navigation, nothing else (VISION Part 5).
 */
export default async function FragmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const fragment = getFragmentBySlug(slug)
  if (!fragment) notFound()

  const all = getAllFragments() // newest first
  const i = all.findIndex((f) => f.slug === slug)
  const newer = i > 0 ? all[i - 1] : undefined
  const older = i < all.length - 1 ? all[i + 1] : undefined

  return (
    <article
      className="mx-auto flex w-full flex-col"
      style={{
        maxWidth: 560,
        minHeight: 'calc(100dvh - 240px)',
        padding: 'calc(var(--u) * 3)',
        paddingTop: 'clamp(calc(var(--u) * 8), 16vh, calc(var(--u) * 22))',
      }}
    >
      <div className="mono-label flex items-center gap-2" style={{ marginBottom: 'calc(var(--u) * 3)' }}>
        <span
          aria-hidden
          className="rounded-full"
          style={{ width: 6, height: 6, background: fragmentDot(fragment.tags) }}
        />
        Fragment
      </div>
      {fragment.media &&
        (isAudioPath(fragment.media) ? (
          <div style={{ marginBottom: 'calc(var(--u) * 3)' }}>
            <AudioPlayer src={fragment.media} label={fragment.title} />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fragment.media}
            alt=""
            className="w-full rounded-lg"
            style={{ marginBottom: 'calc(var(--u) * 3)', border: '1px solid var(--color-line)' }}
          />
        ))}
      {fragment.link && (
        <a
          href={fragment.link}
          rel="noopener"
          className="mono-label"
          style={{ color: 'var(--color-fg-soft)', marginBottom: 'calc(var(--u) * 2)' }}
        >
          {new URL(fragment.link).hostname.replace(/^www\./, '')} ↗
        </a>
      )}
      <div className="prose" style={{ fontSize: 18 }}>
        <MDXContent code={fragment.code} />
      </div>
      <PostMeta entry={fragment} />
      <nav
        className="mono-label flex justify-between"
        aria-label="Fragment navigation"
        style={{ marginTop: 'calc(var(--u) * 6)', paddingTop: 'calc(var(--u) * 2)', borderTop: '1px solid var(--color-line)' }}
      >
        {older ? (
          <Link href={older.permalink} className="transition-colors hover:text-(--color-fg)">
            ← Older
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={newer.permalink} className="transition-colors hover:text-(--color-fg)">
            Newer →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
