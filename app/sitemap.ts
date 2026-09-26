import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/projects'
import { site } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/blog', '/blog/khwabon-ka-bagh'].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
  }))
  const entries = (await getProjects()).map((project) => ({
    url: `${site.url}${project.permalink}`,
    lastModified: new Date(project.facts.pushedAt),
  }))
  return [...pages, ...entries]
}
