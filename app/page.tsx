import fs from 'node:fs'
import path from 'node:path'
import Masthead from '@/components/Masthead'
import Feed from '@/components/Feed'
import { getAllPosts, POST_TYPE_ORDER, type PostType } from '@/lib/posts'

/**
 * Poetry entries whisper their first verse line in the feed.
 * Velite only exposes compiled MDX, so we lift the opening line
 * straight from the source files at render time (server only).
 */
function poetryFirstLines(): Record<string, string> {
  const dir = path.join(process.cwd(), 'content', 'posts')
  const verses: Record<string, string> = {}
  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return verses
  }
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) continue
    const [, fm, body] = match
    if (!/^type:\s*poetry\s*$/m.test(fm)) continue
    const slug = /^slug:\s*(.+?)\s*$/m.exec(fm)?.[1]
    if (!slug) continue
    const line = body
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find(
        (l) =>
          l &&
          !l.startsWith('*') &&
          !l.startsWith('<') &&
          !l.startsWith('#') &&
          !l.startsWith('import '),
      )
    if (line) verses[slug] = line.replace(/\\$/, '')
  }
  return verses
}

type Search = { type?: string | string[] }

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const params = await searchParams
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type
  const initialType = POST_TYPE_ORDER.includes(rawType as PostType)
    ? (rawType as PostType)
    : null

  const posts = getAllPosts()
  const verses = poetryFirstLines()
  const last = String(posts.length).padStart(2, '0')

  return (
    <>
      {/* ---- masthead: the front page of a personal broadsheet ---- */}
      <Masthead last={last} />

      {/* ---- the stream ---- */}
      <Feed posts={posts} initialType={initialType} verses={verses} />
    </>
  )
}
