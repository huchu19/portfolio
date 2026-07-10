/** Every route entrance re-runs the page-enter settle (template remounts per navigation). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>
}
