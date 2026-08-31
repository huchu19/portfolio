export type StudioPost = {
  slug: string
  title: string
  excerpt: string
  permalink: string
  type: 'project' | 'note' | 'journal'
  status?: 'live' | 'in-progress' | 'archived'
  stack?: string[]
  coverImage?: string
}
