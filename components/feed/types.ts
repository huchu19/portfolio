/** Lean, serializable shape the feed grid renders — mapped from Entry on the server. */
export type FeedItemType =
  | 'project'
  | 'essay'
  | 'poetry'
  | 'journal'
  | 'adventure'
  | 'fragment'

export type FeedItem = {
  type: FeedItemType
  title?: string
  permalink: string
  stamp: string // "2026.07.05"
  dateLabel: string // "5 Jul 2026"
  tags: string[]
  lang: 'en' | 'ur' | 'both'
  excerpt: string
  route?: string[]
  media?: string
  link?: string
  readingTime?: number
  status?: string // projects: Live / In Progress / Archived
  stack?: string[] // projects: chips
}
