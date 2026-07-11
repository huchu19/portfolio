/**
 * Adventure route header: LHE → DXB → LHR as mono nodes joined by a thin
 * line that draws itself on load (CSS scaleX; reduced-motion shows it whole).
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
              color: 'var(--color-bone)',
              padding: '0 var(--u)',
              border: '1px solid var(--color-void-line)',
              borderRadius: 4,
              background: 'var(--color-void-raised)',
            }}
          >
            {stop}
          </span>
        </span>
      ))}
    </div>
  )
}
