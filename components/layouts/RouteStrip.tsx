/**
 * Travel hops: LHE → DXB → LHR as mono nodes joined by a thin line that
 * draws itself on load (CSS scaleX; reduced-motion shows it whole).
 *
 * Available to any note — as a header when the post carries `route`, and
 * as an MDX component mid-body.
 */
export default function RouteStrip({ route }: { route: string[] }) {
  return (
    <div className="flex items-center" aria-label={`Route: ${route.join(' to ')}`}>
      {route.map((stop, i) => (
        <span key={`${stop}-${i}`} className="flex items-center" style={{ flex: i > 0 ? 1 : undefined }}>
          {i > 0 && (
            <span aria-hidden className="route-line" style={{ animationDelay: `${i * 0.35}s` }} />
          )}
          <span
            className="font-(family-name:--font-mono)"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              letterSpacing: '0.08em',
              color: 'var(--color-fg)',
              padding: '0 var(--u)',
              border: '1px solid var(--color-line)',
              borderRadius: 4,
              background: 'var(--color-surface)',
            }}
          >
            {stop}
          </span>
        </span>
      ))}
    </div>
  )
}
