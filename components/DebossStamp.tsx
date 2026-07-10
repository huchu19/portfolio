import { useId } from 'react'

/**
 * A letterpress-debossed date stamp (VERDIGRIS BUREAU technique):
 * a light copy of the glyph alpha shifted down and a dark copy shifted up,
 * so the text reads as pressed into the sheet. Framed like a rubber
 * date stamp and set slightly off-square.
 */
export default function DebossStamp({ text }: { text: string }) {
  const raw = useId()
  const id = `deboss-${raw.replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <svg
      role="img"
      aria-label={`Dated ${text}`}
      viewBox="0 0 232 60"
      className="h-[52px] w-auto -rotate-2"
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {/* sheen below the glyph */}
          <feOffset in="SourceAlpha" dy="1.4" result="dn" />
          <feFlood floodColor="#fff9e9" floodOpacity="0.9" />
          <feComposite in2="dn" operator="in" result="hi" />
          {/* shadow above the glyph */}
          <feOffset in="SourceAlpha" dy="-1.2" result="up" />
          <feFlood floodColor="#191309" floodOpacity="0.5" />
          <feComposite in2="up" operator="in" result="sh" />
          <feMerge>
            <feMergeNode in="hi" />
            <feMergeNode in="sh" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <rect
          x="3"
          y="4"
          width="226"
          height="52"
          rx="4"
          fill="none"
          stroke="var(--color-ink-soft)"
          strokeWidth="2"
        />
        <text
          x="116"
          y="38"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="21"
          fontWeight="500"
          letterSpacing="4"
          fill="var(--color-ink-soft)"
        >
          {text}
        </text>
      </g>
    </svg>
  )
}
