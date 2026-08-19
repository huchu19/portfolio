import { ImageResponse } from 'next/og'
import OgCard from '@/components/generative/OgCard'
import { ogFont } from '@/lib/ogFont'
import { getFragmentBySlug } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Fragment card'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fragment = getFragmentBySlug(slug)
  const title = fragment?.title ?? `Fragment · ${fragment?.date.slice(0, 10) ?? ''}`
  return new ImageResponse(
    <OgCard kicker="fragment" title={title} seed={slug} siteName={site.name} />,
    {
      ...size,
      fonts: [{ name: 'Bricolage Grotesque', data: await ogFont(), weight: 400, style: 'normal' }],
    },
  )
}
