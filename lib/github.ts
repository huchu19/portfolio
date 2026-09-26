import { site } from '@/lib/site'

/**
 * Live shipping telemetry from the GitHub public events feed.
 * Revalidates hourly; returns null when the handle is unset or the
 * API is unreachable, and the Now page degrades gracefully.
 */

export type Push = {
  repo: string
  when: string
}

export type Shipping = {
  weekPushes: number
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
export function headers(): HeadersInit {
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
    }>

    // GitHub no longer lists commits inside PushEvent payloads, so a
    // push is counted as a push, not by the commits it carried.
    const weekAgo = Date.now() - 7 * 24 * 3_600_000
    let weekPushes = 0
    const pushes: Push[] = []

    for (const e of events) {
      if (e.type !== 'PushEvent' || !e.repo) continue
      if (new Date(e.created_at).getTime() >= weekAgo) weekPushes += 1
      if (pushes.length < 3) {
        pushes.push({
          repo: e.repo.name.split('/')[1] ?? e.repo.name,
          when: relative(e.created_at),
        })
      }
    }
    return { weekPushes, pushes }
  } catch {
    return null
  }
}

/** What a repo says about itself right now — the dossier's live rows. */
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

/** The masthead line: "last pushed to tifltoys · 4h ago". */
export async function getLastPush(): Promise<string | null> {
  const shipping = await getShipping()
  const last = shipping?.pushes[0]
  if (!last) return null
  return `last pushed to ${last.repo} · ${last.when}`
}
