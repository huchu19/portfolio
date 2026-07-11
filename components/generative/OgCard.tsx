import { INV_PHI } from '@/lib/golden'
import { phyllotaxis, seededRng } from '@/lib/generative'
import { ogPalette as c } from '@/lib/palette'

/**
 * The Open Graph card — void ground, title in Instrument Serif on the
 * major side of the golden split, a seeded phyllotaxis field on the
 * minor side. Rendered by satori, which can't read CSS variables and
 * whose SVG support is unreliable — hence lib/palette.ts hexes and
 * dots drawn as positioned divs, kept ≤ ~180 nodes.
 *
 * Urdu titles: satori has no Nastaliq font here, and tofu is forbidden
 * (hard rule #4) — those cards show the field and the Latin site name.
 */

const BANDS = [c.ash, c.wave, c.ember]

// disc center sits right of the vertical golden line so the field
// never crowds the title column
const CX = 1200 * INV_PHI + 140
const CY = 315
const SCALE = 265

export default function OgCard({
  kicker,
  title,
  seed,
  siteName,
}: {
  kicker: string
  title: string
  seed: string
  siteName: string
}) {
  const urdu = /[؀-ۿ]/.test(title)
  const dots = phyllotaxis(seededRng(seed), 180)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: c.void,
        position: 'relative',
        fontFamily: 'Instrument Serif',
      }}
    >
      {dots.map((d, i) => {
        const r = Math.max(2, d.r * SCALE)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CX + d.x * SCALE - r,
              top: CY + d.y * SCALE - r,
              width: r * 2,
              height: r * 2,
              borderRadius: 999,
              backgroundColor: BANDS[d.band],
              opacity: d.band === 2 ? 0.9 : 0.45,
            }}
          />
        )
      })}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 1200 * INV_PHI,
          height: '100%',
          padding: 72,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: c.ash,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: urdu || title.length > 60 ? 56 : 68,
            lineHeight: 1.08,
            color: c.white,
          }}
        >
          {urdu ? siteName : title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: 89, height: 3, backgroundColor: c.ember, marginRight: 24 }} />
          <div style={{ display: 'flex', fontSize: 26, color: c.ash }}>{urdu ? 'khwabon ka bagh' : siteName}</div>
        </div>
      </div>
    </div>
  )
}
