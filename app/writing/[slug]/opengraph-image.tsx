import { ImageResponse } from 'next/og'
import OgCard from '@/components/generative/OgCard'
import { ogFont } from '@/lib/ogFont'
import { getPostBySlug } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Post card'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return new ImageResponse(
    (
      <OgCard
        kicker={post ? post.type : 'writing'}
        title={post?.title ?? site.title}
        seed={slug}
        siteName={site.name}
      />
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: await ogFont(), weight: 400, style: 'normal' }],
    },
  )
}
