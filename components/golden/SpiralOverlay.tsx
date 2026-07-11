import { goldenSubdivision } from '@/lib/golden'

/**
 * The visible golden spiral + construction squares drawn over the home
 * grid. Real subdivision of the 13×8 fibonacci rectangle — the same
 * geometry the CSS grid uses, so the lines land exactly on the gutters.
 */
export default function SpiralOverlay({ steps = 7 }: { steps?: number }) {
  const { squares, spiralPath } = goldenSubdivision(13, 8, steps)

  return (
    <svg
      aria-hidden
      className="spiral-overlay pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 13 8"
      preserveAspectRatio="none"
      fill="none"
    >
      <g stroke="var(--color-void-line)" vectorEffect="non-scaling-stroke">
        {squares.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            vectorEffect="non-scaling-stroke"
            strokeWidth="1"
          />
        ))}
      </g>
      <path
        className="spiral-path"
        d={spiralPath}
        stroke="var(--color-ember)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        opacity="0.5"
        pathLength={1}
      />
    </svg>
  )
}
