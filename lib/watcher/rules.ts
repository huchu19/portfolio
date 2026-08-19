/**
 * What the desk is allowed to say, and when.
 *
 * The ladder is the whole idea: a rule may only fire once its tier is
 * unlocked, so the site does not open by being familiar with a stranger.
 * Tier 1 notices without addressing you. Tier 2 starts saying "you".
 * Tier 3 tells you things it would not tell a stranger. Tier 4 asks you
 * for something.
 *
 * Adding rules is cheap; adding rules that feel like a person is not.
 * Three that land beat fifteen that pattern-match.
 */

export type Signals = {
  clicks: number
  idleSeconds: number
  scrollDepth: number
  entriesRead: number
  visits: number
  dwellSeconds: number
  filterChurn: boolean
  hourOfDay: number
  revisitedPost: boolean
  emailHover: boolean
}

export type Tier = 1 | 2 | 3 | 4

export type Rule = {
  id: string
  tier: Tier
  when: (s: Signals) => boolean
  say: string | ((s: Signals) => string)
  /** default true — deduped by id in localStorage, for good */
  once?: boolean
}

/** Tier 2 opens when someone has actually settled in. */
export function tierFor(s: Signals, visits: number): Tier {
  if (s.entriesRead >= 4 && visits >= 2) return 4
  if (visits >= 2) return 3
  if (s.entriesRead >= 2 || s.dwellSeconds > 120) return 2
  return 1
}

export const RULES: Rule[] = [
  /* ---- tier 1 — notices, does not address you ---------------------- */
  {
    id: 'first-click',
    tier: 1,
    when: (s) => s.clicks === 1,
    say: 'One click. Noted.',
  },
  {
    id: 'filter-churn',
    tier: 1,
    when: (s) => s.filterChurn,
    say: 'Alright, easy. Nothing here is load-bearing.',
  },
  {
    id: 'deep-scroll',
    tier: 1,
    when: (s) => s.scrollDepth > 90,
    say: 'The bottom of the page. Not many get here.',
  },

  /* ---- tier 2 — starts using "you" -------------------------------- */
  {
    id: 'idle-8',
    tier: 2,
    when: (s) => s.idleSeconds >= 8,
    say: "You've gone quiet. Reading, or gone to make tea?",
  },
  {
    id: 'idle-20',
    tier: 2,
    when: (s) => s.idleSeconds >= 20,
    say: 'Definitely tea.',
  },
  {
    id: 'small-hours',
    tier: 2,
    when: (s) => s.hourOfDay >= 1 && s.hourOfDay <= 4,
    say: "It's gone one in the morning. I'm flattered, but go to sleep.",
  },

  /* ---- tier 3 — tells you what it wouldn't tell a stranger --------- */
  {
    id: 'revisited',
    tier: 3,
    when: (s) => s.revisitedPost,
    say: "Second time through this one. It's my favourite too.",
  },
  {
    id: 'three-entries',
    tier: 3,
    when: (s) => s.entriesRead >= 3,
    say: "Three entries. That's more than my mother's managed.",
  },
  {
    id: 'long-dwell',
    tier: 3,
    when: (s) => s.dwellSeconds > 420,
    say: 'You have been here seven minutes. I rewrote that opening line eleven times, so — thank you.',
  },

  /* ---- tier 4 — breaks the fourth wall and asks ------------------- */
  {
    id: 'email-hover',
    tier: 4,
    when: (s) => s.emailHover,
    say: 'Go on then.',
  },
]
