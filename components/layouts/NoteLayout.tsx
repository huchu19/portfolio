import MDXContent from '@/components/MDXContent'
import CoverArt from '@/components/generative/CoverArt'
import ReadingGarden from '@/components/generative/ReadingGarden'
import AudioPlayer from '@/components/ui/AudioPlayer'
import RouteStrip from './RouteStrip'
import { isAudioPath } from '@/lib/media'
import PostMeta from './PostMeta'
import { formatDate, type Post } from '@/lib/posts'

/**
 * The reading layout — one treatment for everything that is read rather
 * than shipped or logged: essays, travel notes, ghazals.
 *
 * Verse is no longer a first-class type, but it still needs its own
 * air: a note tagged `poetry` drops the cover art and reading time,
 * opens with more space, and sets the body in the poetry measure.
 * A route turns the header into the hop strip; audio hangs a recitation
 * player under the body. None of that needs a separate post type.
 */
export default function NoteLayout({ post }: { post: Post }) {
  const isVerse = post.tags.includes('poetry')
  const urduOnly = post.lang === 'ur'

  return (
    <article
      className="mx-auto w-full"
      style={{
        maxWidth: isVerse ? 640 : 720,
        padding: 'calc(var(--u) * 3)',
        paddingTop: isVerse
          ? 'clamp(calc(var(--u) * 10), 18vh, calc(var(--u) * 24))'
          : 'calc(var(--u) * 10)',
        paddingBottom: isVerse ? 'calc(var(--u) * 16)' : undefined,
      }}
    >
      <header
        style={{ marginBottom: `calc(var(--u) * ${isVerse ? 10 : 6})` }}
      >
        {post.route && post.route.length > 0 && (
          <div style={{ marginBottom: 'calc(var(--u) * 3)' }}>
            <RouteStrip route={post.route} />
          </div>
        )}
        {!isVerse && (
          <div className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
            Note · <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
            {Math.max(1, Math.round(post.metadata.readingTime))} min
          </div>
        )}
        <h1
          className={isVerse ? 'display italic' : 'display'}
          style={
            isVerse
              ? { fontSize: 'clamp(26px, 3.4vw, 38px)', color: 'var(--color-fg-soft)' }
              : { fontSize: 'clamp(36px, 5.5vw, 60px)', lineHeight: 1.05 }
          }
        >
          {post.title}
        </h1>
      </header>

      {!isVerse && !post.coverImage && (
        <CoverArt seed={post.slug} type={post.type} height={160} className="cover-art-block" />
      )}

      <div
        className={
          isVerse
            ? `poetry-body${urduOnly ? ' urdu' : ''}`
            : 'prose note-body post-body'
        }
        {...(isVerse && urduOnly ? { lang: 'ur', dir: 'rtl' } : {})}
      >
        <MDXContent code={post.code} />
      </div>

      {post.media && isAudioPath(post.media) && (
        <div style={{ marginTop: 'calc(var(--u) * 8)' }}>
          <AudioPlayer src={post.media} label={post.title} />
        </div>
      )}

      <PostMeta entry={post} />
      {!isVerse && <ReadingGarden seed={post.slug} />}
    </article>
  )
}
