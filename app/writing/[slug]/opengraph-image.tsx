import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import {
  getAllPosts,
  getPostBySlug,
  entryNumber,
  formatStamp,
  POST_TYPES,
} from '@/lib/posts'
import { loadGoogleFont, OG } from '@/lib/og'

export const size = { width: OG.width, height: OG.height }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const label = POST_TYPES[post.type].label.toUpperCase()
  const stamp = formatStamp(post.date)
  const n = entryNumber(post)
  const monoText = `HUSSAIN NAQVI—FIELD NOTES№0123456789· ${label}${stamp}ENTRY`
  const titleSize = post.title.length > 44 ? 62 : 76

  const [fraunces, mono] = await Promise.all([
    loadGoogleFont('Fraunces', post.title + 'Field Notes.', 600),
    loadGoogleFont('IBM Plex Mono', monoText, 500),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: OG.paper,
          color: OG.ink,
          padding: '60px 72px',
          borderLeft: `14px solid ${OG.accent}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Mono',
              fontSize: 22,
              letterSpacing: 3,
              color: OG.inkSoft,
            }}
          >
            <span>HUSSAIN NAQVI — FIELD NOTES</span>
            <span style={{ marginTop: 10, color: OG.accentDeep }}>
              № {n} · {label}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Mono',
              fontSize: 24,
              letterSpacing: 4,
              color: OG.inkSoft,
              border: `3px solid ${OG.inkSoft}`,
              borderRadius: 6,
              padding: '14px 22px',
              transform: 'rotate(-2deg)',
            }}
          >
            {stamp}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Fraunces',
            fontSize: titleSize,
            lineHeight: 1.06,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {post.title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Mono',
            fontSize: 20,
            letterSpacing: 3,
            color: OG.inkFaint,
            paddingTop: 24,
            borderTop: `2px solid ${OG.line}`,
          }}
        >
          <span>ENTRY № {n}</span>
          <span>FIELD NOTES · 2026</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 600 },
        { name: 'Mono', data: mono, weight: 500 },
      ],
    },
  )
}
