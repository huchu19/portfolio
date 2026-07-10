import { ImageResponse } from 'next/og'
import { loadGoogleFont, OG } from '@/lib/og'

export const size = { width: OG.width, height: OG.height }
export const contentType = 'image/png'
export const alt = 'Hussain Naqvi — Field Notes'

export default async function Image() {
  const kicker = 'HUSSAIN NAQVI · ONE STREAM, NUMBERED LIKE A LEDGER'
  const [fraunces, mono] = await Promise.all([
    loadGoogleFont('Fraunces', 'Huchu Notes.', 600),
    loadGoogleFont('IBM Plex Mono', kicker + '№ 2026 ·—', 500),
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
          padding: '64px 72px',
          borderBottom: `14px solid ${OG.accent}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Mono',
            fontSize: 22,
            letterSpacing: 3,
            color: OG.inkSoft,
            paddingBottom: 24,
            borderBottom: `2px solid ${OG.ink}`,
          }}
        >
          <span>HUSSAIN NAQVI</span>
          <span style={{ color: OG.inkFaint }}>№ 2026</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Fraunces',
            fontSize: 148,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          <span>Huchu</span>
          <span style={{ marginLeft: 160, display: 'flex' }}>
            Notes<span style={{ color: OG.accent }}>.</span>
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Mono',
            fontSize: 20,
            letterSpacing: 3,
            color: OG.inkFaint,
          }}
        >
          ONE STREAM, NUMBERED LIKE A LEDGER
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
