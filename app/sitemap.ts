import type { MetadataRoute } from 'next'
import { getFeed } from '@/lib/posts'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/blog', '/blog/khwabon-ka-bagh'].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
  }))
  const entries = getFeed().map((entry) => ({
    url: `${site.url}${entry.permalink}`,
    lastModified: new Date(entry.date),
  }))
  return [...pages, ...entries]
}
