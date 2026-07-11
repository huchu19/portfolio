/**
 * Footnotes: outer-gutter notes on wide screens, inline disclosure on
 * mobile (VISION essay brief). CSS in globals handles the two modes.
 */
export default function Footnote({
  n,
  children,
}: {
  n: number
  children: React.ReactNode
}) {
  return (
    <span className="footnote">
      <sup className="footnote-marker" aria-label={`Footnote ${n}`}>
        {n}
      </sup>
      <span className="footnote-body" role="note">
        <span className="footnote-n">{n} — </span>
        {children}
      </span>
    </span>
  )
}
