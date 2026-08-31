import { ImageResponse } from 'next/og'
import OgCard from '@/components/generative/OgCard'
import { ogFont } from '@/lib/ogFont'
import { getSignatureDataUrl } from '@/lib/brand'
import { getPostBySlug } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Project card'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getPostBySlug(slug)
  const signatureSrc = await getSignatureDataUrl()

  return new ImageResponse(
    (
      <OgCard
        kicker="project"
        title={project?.title ?? site.title}
        seed={slug}
        siteName={site.name}
        signatureSrc={signatureSrc}
      />
    ),
    {
      ...size,
      fonts: [{ name: 'Bricolage Grotesque', data: await ogFont(), weight: 400, style: 'normal' }],
    },
  )
}
