import { INV_PHI } from '@/lib/golden'
import { flowStrokes, phyllotaxis, seededRng } from '@/lib/generative'

/**
 * Seeded cover art — every entry without a photograph grows its own
 * geometry instead. Deterministic per slug (server-rendered SVG, zero
 * client JS), drawn on the 13×8 golden viewBox so it rhymes with the
 * home grid. Colors are tokens, so light mode is free.
 */

const BANDS = ['var(--color-ash)', 'var(--color-wave)', 'var(--color-ember)']
const FRAGMENT_BANDS = ['var(--color-ash)', 'var(--color-moss)', 'var(--color-ember)']

type Props = {
  seed: string
  type: string
  /** rendered height in px; the art crops, never distorts */
  height?: number
  className?: string
}

export default function CoverArt({ seed, type, height = 220, className }: Props) {
  const rng = seededRng(seed)
  const bands = type === 'fragment' ? FRAGMENT_BANDS : BANDS
  const dotty = type === 'project' || type === 'poetry' || type === 'fragment'

  return (
    <div
      aria-hidden
      className={className}
      style={{
        height,
        overflow: 'hidden',
        borderRadius: 8,
        border: '1px solid var(--color-void-line)',
        background: 'var(--color-void-raised)',
      }}
    >
      <svg
        viewBox="0 0 13 8"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {dotty
          ? phyllotaxis(rng, type === 'poetry' ? 89 : 233).map((d, i) => (
              <circle
                key={i}
                cx={13 * INV_PHI + d.x * 3.4}
                cy={4 + d.y * 3.4}
                r={d.r * 3.4}
                fill={bands[d.band]}
                opacity={d.band === 2 ? 0.85 : 0.5}
              />
            ))
          : flowStrokes(rng, type === 'journal' ? 34 : 55).map((s, i) => (
              <path
                key={i}
                d={`M ${s.points.map((p) => `${(p.x * 13).toFixed(3)} ${(p.y * 8).toFixed(3)}`).join(' L ')}`}
                fill="none"
                stroke={bands[s.band]}
                strokeWidth={0.045}
                strokeLinecap="round"
                opacity={s.band === 2 ? 0.8 : 0.45}
              />
            ))}
      </svg>
    </div>
  )
}
