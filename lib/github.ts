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

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return 'within the hour'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'yesterday' : `${d}d ago`
}

export async function getShipping(): Promise<Shipping | null> {
  if (!site.githubUser || site.githubUser === 'your-handle') return null
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/events/public?per_page=30`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      },
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
