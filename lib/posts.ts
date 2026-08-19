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
  { label: string; plural: string; glyph: string; dot: string }
> = {
  project: {
    label: 'Project',
    plural: 'Projects',
    glyph: '⌗',
    dot: 'var(--dot-project)',
  },
  note: { label: 'Note', plural: 'Notes', glyph: '§', dot: 'var(--dot-note)' },
  journal: {
    label: 'Journal',
    plural: 'Journal',
    glyph: '¶',
    dot: 'var(--dot-journal)',
  },
  fragment: {
    label: 'Fragment',
    plural: 'Fragments',
    glyph: '·',
    dot: 'var(--dot-fragment)',
  },
}

export const ENTRY_TYPE_ORDER: EntryType[] = [
  'project',
  'note',
  'journal',
  'fragment',
]

import type { FeedItem } from '@/components/feed/types'

/** Map an Entry to the lean shape the client feed grid renders. */
export function toFeedItem(entry: Entry): FeedItem {
  const base = {
    type: entry.type,
    permalink: entry.permalink,
    stamp: formatStamp(entry.date),
    dateLabel: formatDate(entry.date),
    tags: entry.tags,
    lang: entry.lang,
    excerpt: entry.excerpt,
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
