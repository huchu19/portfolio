'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { RULES, tierFor, type Signals, type Tier } from '@/lib/watcher/rules'

/* ------------------------------------------------------------------ */
/*  Persistence — the part that beats starting every visitor at zero   */
/* ------------------------------------------------------------------ */

const KEY = 'fn-watcher'
const READ_KEY = 'fn-watcher-read'

type Stored = {
  visits: number
  said: string[]
  tier: Tier
}

function load(): Stored {
  if (typeof window === 'undefined') return { visits: 0, said: [], tier: 1 }
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return { visits: 0, said: [], tier: 1 }
    const parsed = JSON.parse(raw) as Partial<Stored>
    return {
      visits: parsed.visits ?? 0,
      said: parsed.said ?? [],
      tier: (parsed.tier ?? 1) as Tier,
    }
  } catch {
    return { visits: 0, said: [], tier: 1 }
  }
}

function save(s: Stored) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* private mode — the Watcher simply forgets, which is survivable */
  }
}

function readSet(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(READ_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type WatcherValue = {
  /** the note currently in the margin, or null */
  note: string | null
  /** hover the footer email to unlock the tier-4 line */
  markEmailHover: () => void
}

const WatcherContext = createContext<WatcherValue>({
  note: null,
  markEmailHover: () => {},
})

export function useWatcher() {
  return useContext(WatcherContext)
}

/* one note per 20s, five per session, hard stop */
const THROTTLE_MS = 20_000
const MAX_PER_SESSION = 5

export default function WatcherProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [note, setNote] = useState<string | null>(null)

  // Signals live in a ref: they change every second and must never
  // re-render the tree on their own.
  const sig = useRef<Signals>({
    clicks: 0,
    idleSeconds: 0,
    scrollDepth: 0,
    entriesRead: 0,
    visits: 0,
    dwellSeconds: 0,
    filterChurn: false,
    hourOfDay: new Date().getHours(),
    revisitedPost: false,
    emailHover: false,
  })

  const stored = useRef<Stored>({ visits: 0, said: [], tier: 1 })
  const spokenThisSession = useRef(0)
  const lastSpokeAt = useRef(0)
  const filterClicks = useRef<number[]>([])

  /* -------- session bootstrap: count the visit once --------------- */
  useEffect(() => {
    const s = load()
    s.visits += 1
    stored.current = s
    sig.current.visits = s.visits
    sig.current.entriesRead = readSet().length
    save(s)
  }, [])

  /* -------- speak: the one place a note is allowed to appear ------- */
  const speak = useCallback((id: string, text: string) => {
    const now = Date.now()
    if (spokenThisSession.current >= MAX_PER_SESSION) return
    if (now - lastSpokeAt.current < THROTTLE_MS) return
    if (stored.current.said.includes(id)) return

    lastSpokeAt.current = now
    spokenThisSession.current += 1
    stored.current.said.push(id)
    save(stored.current)
    setNote(text)

    // the note retires on its own; the gutter stays reserved
    window.setTimeout(() => setNote(null), 9_000)
  }, [])

  const evaluate = useCallback(() => {
    const s = sig.current
    const tier = tierFor(s, stored.current.visits)
    if (tier > stored.current.tier) {
      stored.current.tier = tier
      save(stored.current)
    }
    // Highest unlocked tier wins. Idle rules match almost continuously,
    // so scanning in array order would bury the conspiratorial copy the
    // ladder exists to deliver.
    const candidates = RULES.filter(
      (r) =>
        r.tier <= tier &&
        !stored.current.said.includes(r.id) &&
        r.when(s),
    ).sort((a, b) => b.tier - a.tier)

    const rule = candidates[0]
    if (rule) {
      speak(rule.id, typeof rule.say === 'function' ? rule.say(s) : rule.say)
    }
  }, [speak])

  /* -------- input listeners --------------------------------------- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      sig.current.clicks += 1
      sig.current.idleSeconds = 0

      // four filter pills inside five seconds reads as restlessness
      const el = e.target as HTMLElement | null
      if (el?.closest('nav[aria-label="Filter feed"]')) {
        const now = Date.now()
        filterClicks.current = [
          ...filterClicks.current.filter((t) => now - t < 5_000),
          now,
        ]
        if (filterClicks.current.length >= 4) sig.current.filterChurn = true
      }
      evaluate()
    }
    const wake = () => {
      sig.current.idleSeconds = 0
    }
    const onScroll = () => {
      sig.current.idleSeconds = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      if (pct > sig.current.scrollDepth) sig.current.scrollDepth = pct
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', wake)
    document.addEventListener('mousemove', wake, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', wake)
      document.removeEventListener('mousemove', wake)
      window.removeEventListener('scroll', onScroll)
    }
  }, [evaluate])

  /* -------- the one-second tick, paused when the tab is hidden ----- */
  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.hidden) return
      sig.current.idleSeconds += 1
      sig.current.dwellSeconds += 1
      sig.current.hourOfDay = new Date().getHours()
      evaluate()
    }, 1000)
    return () => window.clearInterval(tick)
  }, [evaluate])

  /* -------- per-route: reset depth, record what got read ---------- */
  useEffect(() => {
    sig.current.scrollDepth = 0
    sig.current.idleSeconds = 0
    if (!pathname?.startsWith('/writing/')) return

    const seen = readSet()
    sig.current.revisitedPost = seen.includes(pathname)

    // an entry counts as read at 70% depth, once
    const check = window.setInterval(() => {
      if (sig.current.scrollDepth <= 70) return
      window.clearInterval(check)
      if (seen.includes(pathname)) return
      const next = [...seen, pathname]
      try {
        window.localStorage.setItem(READ_KEY, JSON.stringify(next))
      } catch {
        /* nothing to do — the count simply doesn't persist */
      }
      sig.current.entriesRead = next.length
    }, 1000)
    return () => window.clearInterval(check)
  }, [pathname])

  const markEmailHover = useCallback(() => {
    sig.current.emailHover = true
    evaluate()
  }, [evaluate])

  return (
    <WatcherContext.Provider value={{ note, markEmailHover }}>
      {children}
    </WatcherContext.Provider>
  )
}
