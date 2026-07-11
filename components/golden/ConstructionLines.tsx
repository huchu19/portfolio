import { goldenSubdivision, INV_PHI } from '@/lib/golden'

/**
 * The construction-line layer (VISION.md Part 4): the golden subdivision
 * drawn as architectural draft lines at ~3.5% opacity behind everything.
 * Real fibonacci ratios — not decoration.
 */
export default function ConstructionLines() {
  const W = 1440
  const H = W * INV_PHI
  const { squares, spiralPath } = goldenSubdivision(W, H, 9)

  return (
    <svg
      aria-hidden
      className="construction-layer pointer-events-none fixed inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 1 }}
    >
      <g stroke="var(--color-bone)" strokeWidth="1" fill="none">
        {squares.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
        ))}
        <path d={spiralPath} stroke="var(--color-ember)" />
      </g>
    </svg>
  )
}
