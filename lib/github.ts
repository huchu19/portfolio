import { site } from '@/lib/site'

/**
 * Live shipping telemetry from the GitHub public events feed.
 * Revalidates hourly; returns null when the handle is unset or the
 * API is unreachable, and the Now page degrades gracefully.
 */

export type Push = {
  repo: string
  message: string
  when: string
}

export type Shipping = {
  weekCommits: number
  pushes: Push[]
}

export function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return 'within the hour'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'yesterday' : `${d}d ago`
}

/** A token lifts the rate ceiling from 60 to 5,000 requests/hour. */
function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

export async function getShipping(): Promise<Shipping | null> {
  if (!site.githubUser || site.githubUser === 'your-handle') return null
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/events/public?per_page=30`,
      { headers: headers(), next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const events = (await res.json()) as Array<{
      type: string
      created_at: string
      repo?: { name: string }
      payload?: { commits?: Array<{ message: string }> }
    }>

    const weekAgo = Date.now() - 7 * 24 * 3_600_000
    let weekCommits = 0
    const pushes: Push[] = []

    for (const e of events) {
      if (e.type !== 'PushEvent') continue
      const commits = e.payload?.commits ?? []
      if (new Date(e.created_at).getTime() >= weekAgo) {
        weekCommits += commits.length
      }
      if (pushes.length < 3 && e.repo && commits.length > 0) {
        pushes.push({
          repo: e.repo.name.split('/')[1] ?? e.repo.name,
          message: commits[commits.length - 1].message.split('\n')[0],
          when: relative(e.created_at),
        })
      }
    }
    return { weekCommits, pushes }
  } catch {
    return null
  }
}

/**
 * What a repo says about itself right now — the rows a project dossier
 * cannot know at build time from frontmatter alone.
 */
export type RepoFacts = {
  description: string | null
  stars: number
  language: string | null
  /** bytes per language, straight from /languages */
  languages: Record<string, number>
  pushedAt: string
  /** "3d ago" — pushedAt, pre-formatted for the mono spec table */
  pushedLabel: string
  url: string
}

/** `fullName` is "owner/repo". Null on any failure — never blank a page. */
export async function getRepoFacts(fullName: string): Promise<RepoFacts | null> {
  if (!fullName || !fullName.includes('/')) return null
  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}`, {
        headers: headers(),
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/repos/${fullName}/languages`, {
        headers: headers(),
        next: { revalidate: 3600 },
      }),
    ])
    if (!repoRes.ok) return null

    const repo = (await repoRes.json()) as {
      description: string | null
      stargazers_count: number
      language: string | null
      pushed_at: string
      html_url: string
    }
    // A missing language breakdown is survivable; a missing repo is not.
    const languages = langRes.ok
      ? ((await langRes.json()) as Record<string, number>)
      : {}

    return {
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      languages,
      pushedAt: repo.pushed_at,
      pushedLabel: relative(repo.pushed_at),
      url: repo.html_url,
    }
  } catch {
    return null
  }
}

/** The masthead line: "last pushed to tifltoys · 4h ago". */
export async function getLastPush(): Promise<string | null> {
  const shipping = await getShipping()
  const last = shipping?.pushes[0]
  if (!last) return null
  return `last pushed to ${last.repo} · ${last.when}`
}
