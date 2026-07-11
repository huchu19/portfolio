import fs from 'node:fs'
import path from 'node:path'
import { posts, fragments } from '@/.velite'

export type Post = (typeof posts)[number]
export type Fragment = (typeof fragments)[number]
/** Everything that lives in the feed — full posts and fragments alike. */
export type Entry = Post | Fragment
export type EntryType = Entry['type']
export type Lang = Entry['lang']

const publishedPosts = posts.filter((p) => !p.draft)
const publishedFragments = fragments.filter((f) => !f.draft)

const desc = (a: Entry, b: Entry) => b.date.localeCompare(a.date)

export function getAllPosts(): Post[] {
  return [...publishedPosts].sort(desc)
}

export function getAllFragments(): Fragment[] {
  return [...publishedFragments].sort(desc)
}

/** The feed: posts and fragments interleaved, newest first. */
export function getFeed(): Entry[] {
  return [...publishedPosts, ...publishedFragments].sort(desc)
}

export function getPostBySlug(slug: string): Post | undefined {
  return publishedPosts.find((p) => p.slug === slug)
}

export function getFragmentBySlug(slug: string): Fragment | undefined {
  return publishedFragments.find((f) => f.slug === slug)
}

export function isFragment(entry: Entry): entry is Fragment {
  return entry.type === 'fragment'
}

/** Newest year first; entries inside each year newest first. */
export function getFeedGroupedByYear(): [string, Entry[]][] {
  const groups = new Map<string, Entry[]>()
  for (const entry of getFeed()) {
    const year = entry.date.slice(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(entry)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}

export const ENTRY_TYPES: Record<
  EntryType,
  { label: string; plural: string; dot: string }
> = {
  project: { label: 'Project', plural: 'Projects', dot: 'var(--dot-project)' },
  essay: { label: 'Essay', plural: 'Essays', dot: 'var(--dot-essay)' },
  poetry: { label: 'Poetry', plural: 'Poetry', dot: 'var(--dot-poetry)' },
  journal: { label: 'Journal', plural: 'Journal', dot: 'var(--dot-journal)' },
  adventure: {
    label: 'Adventure',
    plural: 'Adventures',
    dot: 'var(--dot-adventure)',
  },
  fragment: {
    label: 'Fragment',
    plural: 'Fragments',
    dot: 'var(--dot-fragment)',
  },
}

export const ENTRY_TYPE_ORDER: EntryType[] = [
  'project',
  'essay',
  'poetry',
  'journal',
  'adventure',
  'fragment',
]

import type { FeedItem } from '@/components/feed/types'

/**
 * Poetry panels whisper the poem's opening line, not the excerpt.
 * Velite only exposes compiled MDX, so we lift it from source (server only).
 */
let poetryLines: Map<string, string> | null = null
function poetryFirstLine(slug: string): string | undefined {
  if (!poetryLines) {
    poetryLines = new Map()
    const dir = path.join(process.cwd(), 'content', 'posts')
    let files: string[] = []
    try {
      files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    } catch {
      return undefined
    }
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!fm) continue
      if (!/^type:\s*poetry\s*$/m.test(fm[1])) continue
      const s = fm[1].match(/^slug:\s*(\S+)\s*$/m)?.[1]
      if (!s) continue
      const line = fm[2]
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l && !l.startsWith('<') && !/^[*_].*[*_]$/.test(l))
      if (line) poetryLines.set(s, line.replace(/\\$/, '').trim())
    }
  }
  return poetryLines.get(slug)
}

/** Map an Entry to the lean shape the client feed grid renders. */
export function toFeedItem(entry: Entry): FeedItem {
  const base = {
    type: entry.type,
    permalink: entry.permalink,
    stamp: formatStamp(entry.date),
    dateLabel: formatDate(entry.date),
    tags: entry.tags,
    lang: entry.lang,
    excerpt:
      entry.type === 'poetry'
        ? (poetryFirstLine(entry.slug) ?? entry.excerpt)
        : entry.excerpt,
  }
  if (isFragment(entry)) {
    return { ...base, title: entry.title, media: entry.media, link: entry.link }
  }
  return {
    ...base,
    title: entry.title,
    route: entry.route,
    stack: entry.stack,
    status: entry.status,
    readingTime: Math.max(1, Math.round(entry.metadata.readingTime)),
  }
}

/** "12 Jun 2026" — the human date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2026.06.12" — the machine stamp for mono labels. */
export function formatStamp(iso: string): string {
  return iso.slice(0, 10).replaceAll('-', '.')
}
