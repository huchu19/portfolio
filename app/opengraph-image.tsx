import { ImageResponse } from 'next/og'
import OgCard from '@/components/generative/OgCard'
import { ogFont } from '@/lib/ogFont'
import { getSignatureDataUrl } from '@/lib/brand'
import { site } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = site.title

export default async function Image() {
  const signatureSrc = await getSignatureDataUrl()
  return new ImageResponse(
    (
      <OgCard
        kicker="software engineer"
        title={site.name}
        seed="hussain-naqvi"
        siteName="projects and documentation"
        signatureSrc={signatureSrc}
      />
    ),
    {
      ...size,
      fonts: [{ name: 'Bricolage Grotesque', data: await ogFont(), weight: 400, style: 'normal' }],
    },
  )
}
