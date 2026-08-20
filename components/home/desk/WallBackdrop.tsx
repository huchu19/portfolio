import { goldenSubdivision, INV_PHI } from '@/lib/golden'
import { VIEW_W, VIEW_H } from './DeskFigure'

/**
 * The wall plane itself — decorative, aria-hidden, purely a backdrop for
 * the real interactive WallObjects laid on top of it. Echoes the same
 * golden-ratio construction lines as ConstructionLines.tsx, at a higher
 * opacity than the site-wide 3.5% layer, so the wall reads as its own zone
 * rather than more background noise.
 *
 * The subdivision math only holds for a true golden rectangle (goldenSubdivision
 * cuts squares in strict rotation and runs negative once the aspect ratio
 * drifts from φ), so it's computed in its own golden viewBox, then sliced to
 * fill the scene's actual 16:9 box — same technique ConstructionLines uses.
 */
export default function WallBackdrop() {
  const GOLDEN_W = VIEW_W
  const GOLDEN_H = GOLDEN_W * INV_PHI
  const { squares, spiralPath } = goldenSubdivision(GOLDEN_W, GOLDEN_H, 8)

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'var(--color-surface)' }}>
      <svg
        viewBox={`0 0 ${GOLDEN_W} ${GOLDEN_H}`}
        preserveAspectRatio="xMidYMax slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g stroke="var(--color-fg)" strokeWidth={1} fill="none" opacity={0.07}>
          {squares.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
          ))}
          <path d={spiralPath} stroke="var(--color-accent)" />
        </g>
      </svg>
    </div>
  )
}
