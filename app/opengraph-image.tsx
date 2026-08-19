import { ImageResponse } from 'next/og'
import OgCard from '@/components/generative/OgCard'
import { ogFont } from '@/lib/ogFont'
import { site } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = site.title

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="khwabon ka bagh"
        title={site.name}
        seed="khwabon-ka-bagh"
        siteName="a universe, not a portfolio"
      />
    ),
    {
      ...size,
      fonts: [{ name: 'Bricolage Grotesque', data: await ogFont(), weight: 400, style: 'normal' }],
    },
  )
}
