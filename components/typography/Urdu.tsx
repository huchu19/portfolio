/**
 * The Nastaliq wrapper — every piece of Urdu text on the site goes
 * through this (or carries the same three attributes by hand).
 * Hard rule #4: Nastaliq + dir="rtl" + lang="ur", always.
 */
export default function Urdu({
  children,
  size,
  className = '',
}: {
  children: React.ReactNode
  size?: number | string
  className?: string
}) {
  return (
    <span
      lang="ur"
      dir="rtl"
      className={`urdu block ${className}`}
      style={size ? { fontSize: size } : undefined}
    >
      {children}
    </span>
  )
}
