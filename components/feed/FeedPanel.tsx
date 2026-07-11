'use client'

import Link from 'next/link'
import type { FeedItem } from './types'
import { fragmentDot } from './tagColors'

export { fragmentDot }

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Grid spans per type — the shapes that keep the feed from collapsing into uniform cards. */
export const PANEL_SHAPE: Record<FeedItem['type'], string> = {
  project: 'col-span-2 row-span-2',
  essay: 'col-span-2 row-span-1',
  poetry: 'col-span-1 row-span-2',
  journal: 'col-span-1 row-span-1',
  adventure: 'col-span-2 row-span-1',
  fragment: 'col-span-1 row-span-1',
}

const pad = { padding: 'calc(var(--u) * 2)' } as const

export default function FeedPanel({ item }: { item: FeedItem }) {
  switch (item.type) {
    case 'project':
      return (
        <Link href={item.permalink} className="panel flex h-full flex-col justify-between overflow-hidden" style={{ ...pad, borderLeft: '2px solid var(--color-ember)' }}>
          <div>
            <div className="mono-label flex items-center gap-2" style={{ marginBottom: 'var(--u)' }}>
              <span style={{ color: 'var(--color-ember)' }}>Project</span>
              <span>{item.stamp}</span>
            </div>
            <h3 className="display" style={{ fontSize: 24 }}>{item.title}</h3>
            <p className="line-clamp-3" style={{ marginTop: 'var(--u)', fontSize: 14, color: 'var(--color-ash)' }}>
              {item.excerpt}
            </p>
          </div>
          {item.stack && item.stack.length > 0 && (
            <div className="mono-label" style={{ fontSize: 11 }}>
              {item.stack.join(' · ')}
            </div>
          )}
        </Link>
      )

    case 'essay':
      return (
        <Link href={item.permalink} className="panel flex h-full flex-col justify-center overflow-hidden" style={pad}>
          <div className="mono-label" style={{ marginBottom: 'var(--u)' }}>
            Essay · {item.readingTime} min
          </div>
          <h3 className="display line-clamp-2" style={{ fontSize: 21 }}>{item.title}</h3>
          <p className="line-clamp-2" style={{ marginTop: 'var(--u)', fontSize: 13.5, color: 'var(--color-ash)' }}>
            {item.excerpt}
          </p>
        </Link>
      )

    case 'poetry':
      // tall + narrow, maximum negative space; first words ghosted in display face
      return (
        <Link href={item.permalink} className="panel flex h-full flex-col justify-between overflow-hidden" style={pad}>
          <div className="mono-label" style={{ color: 'var(--color-ember-bright)' }}>Poetry</div>
          {item.lang !== 'en' ? (
            <p lang="ur" dir="rtl" className="urdu line-clamp-4" style={{ fontSize: 18, opacity: 0.55 }}>
              {item.excerpt}
            </p>
          ) : (
            <p className="display line-clamp-5 italic" style={{ fontSize: 19, opacity: 0.45, lineHeight: 1.4 }}>
              {item.excerpt}
            </p>
          )}
          <div className="display" style={{ fontSize: 15, color: 'var(--color-bone)' }}>{item.title}</div>
        </Link>
      )

    case 'journal':
      return (
        <Link href={item.permalink} className="panel flex h-full flex-col justify-between overflow-hidden" style={pad}>
          <div className="font-(family-name:--font-mono)" style={{ fontSize: 20, color: 'var(--color-ash)', fontVariantNumeric: 'tabular-nums' }}>
            {item.stamp}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--color-bone)' }} className="line-clamp-2">
            {item.title}
          </div>
        </Link>
      )

    case 'adventure':
      return (
        <Link href={item.permalink} className="panel flex h-full flex-col justify-center gap-2 overflow-hidden" style={pad}>
          <div className="mono-label" style={{ color: 'var(--color-wave)' }}>Adventure · {item.stamp}</div>
          {item.route && (
            <div className="flex items-center gap-2 font-(family-name:--font-mono)" style={{ fontSize: 15, color: 'var(--color-bone)' }}>
              {item.route.map((stop, i) => (
                <span key={stop} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden style={{ color: 'var(--color-wave)' }}>→</span>}
                  {stop}
                </span>
              ))}
            </div>
          )}
          <div className="line-clamp-1" style={{ fontSize: 13.5, color: 'var(--color-ash)' }}>{item.title}</div>
        </Link>
      )

    case 'fragment': {
      const dot = fragmentDot(item.tags)
      return (
        <Link href={item.permalink} className="panel relative flex h-full flex-col overflow-hidden" style={pad}>
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{ top: 'calc(var(--u) * 2)', right: 'calc(var(--u) * 2)', width: 6, height: 6, background: dot }}
          />
          {item.media ? (
            <span className="flex h-full flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.media} alt="" className="min-h-0 flex-1 rounded object-cover" loading="lazy" />
              <span className="line-clamp-2" style={{ fontSize: 12.5, color: 'var(--color-ash)' }}>{item.excerpt}</span>
            </span>
          ) : (
            <span className="my-auto flex flex-col gap-1">
              {item.link && (
                <span className="mono-label" style={{ fontSize: 10.5, color: 'var(--color-wave)' }}>
                  {domainOf(item.link)}
                </span>
              )}
              <span className="line-clamp-4" style={{ fontSize: 13, color: 'var(--color-bone)', lineHeight: 1.55 }}>
                {item.excerpt}
              </span>
            </span>
          )}
        </Link>
      )
    }
  }
}
