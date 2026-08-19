/**
 * The two marks of an unedited draft.
 *
 * `Cut` is a sentence that didn't survive — struck through, dimmed, but
 * still legible, because the point of showing the draft is that you can
 * read what was lost. `Doubt` is the note in the margin arguing with it.
 */

export function Cut({ children }: { children: React.ReactNode }) {
  return (
    <del className="revision-cut">
      {children}
    </del>
  )
}

export function Doubt({ children }: { children: React.ReactNode }) {
  return (
    <aside className="revision-doubt">
      <span aria-hidden className="revision-doubt-mark">
        ✎
      </span>
      <span>{children}</span>
    </aside>
  )
}
