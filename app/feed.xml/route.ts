import { getAllPosts, POST_TYPES } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

function esc(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function GET() {
  const items = getAllPosts()
    .map(
      (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${site.url}${post.permalink}</link>
      <guid isPermaLink="true">${site.url}${post.permalink}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${esc(POST_TYPES[post.type].label)}</category>
      <description>${esc(post.excerpt)}</description>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.title)}</title>
    <link>${site.url}</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(site.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
