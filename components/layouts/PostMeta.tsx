import { formatDate, type Entry } from '@/lib/posts'

/** Date + tags, barely there in ash — sits at the very bottom of layouts. */
export default function PostMeta({ entry }: { entry: Entry }) {
  return (
    <div
      className="mono-label flex flex-wrap items-baseline gap-x-4 gap-y-1"
      style={{ marginTop: 'calc(var(--u) * 8)', opacity: 0.75 }}
    >
      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      {entry.tags.map((t) => (
        <span key={t}>#{t}</span>
      ))}
    </div>
  )
}
