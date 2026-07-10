import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/archive', '/about', '/now', '/colophon'].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
  }))
  const posts = getAllPosts().map((post) => ({
    url: `${site.url}${post.permalink}`,
    lastModified: new Date(post.date),
  }))
  return [...pages, ...posts]
}
