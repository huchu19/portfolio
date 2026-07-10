import { posts } from '@/.velite'

export type Post = (typeof posts)[number]
export type PostType = Post['type']

const published = posts.filter((p) => !p.draft)
const byDateAsc = [...published].sort((a, b) => a.date.localeCompare(b.date))

export function getAllPosts(): Post[] {
  return [...published].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): Post | undefined {
  return published.find((p) => p.slug === slug)
}

export function getPostsByType(type: PostType): Post[] {
  return getAllPosts().filter((p) => p.type === type)
}

/** Newest year first; posts inside each year newest first. */
export function getPostsGroupedByYear(): [string, Post[]][] {
  const groups = new Map<string, Post[]>()
  for (const post of getAllPosts()) {
    const year = post.date.slice(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(post)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}

/** № 01 is the oldest post — entries are numbered like a ledger. */
export function entryNumber(post: Post): string {
  const i = byDateAsc.findIndex((p) => p.slug === post.slug)
  return String(i + 1).padStart(2, '0')
}

export const POST_TYPES: Record<
  PostType,
  { label: string; plural: string; glyph: string }
> = {
  project: { label: 'Project', plural: 'Projects', glyph: '⌗' },
  essay: { label: 'Essay', plural: 'Essays', glyph: '§' },
  poetry: { label: 'Poetry', plural: 'Poetry', glyph: '❦' },
  journal: { label: 'Journal', plural: 'Journal', glyph: '¶' },
  adventure: { label: 'Adventure', plural: 'Adventures', glyph: '⁂' },
}

export const POST_TYPE_ORDER: PostType[] = [
  'project',
  'essay',
  'poetry',
  'journal',
  'adventure',
]

/** "12 Jun 2026" — the human date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2026·06·12" — the machine stamp. */
export function formatStamp(iso: string): string {
  return iso.slice(0, 10).replaceAll('-', '·')
}
