'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * The field-notes shell — press ~ anywhere (or the footer's ~) and a
 * terminal slides up from the desk. FABLE SHELL lineage: a fake terminal
 * with genuinely working commands. Esc closes it.
 */

export type TermPost = {
  n: string
  slug: string
  permalink: string
  type: string
  date: string
  title: string
}

type Line = { text: string; tone?: 'dim' | 'accent' | 'cmd' }

const BANNER: Line[] = [
  { text: 'field-notes shell — the site, without the typography', tone: 'dim' },
  { text: "type 'help' for commands · esc closes", tone: 'dim' },
]

const HELP: Line[] = [
  { text: 'help              this list' },
  { text: 'ls                every entry in the ledger' },
  { text: 'open <№|slug>     read an entry' },
  { text: 'grep <term>       search the ledger' },
  { text: 'go <page>         feed · archive · about · now · colophon' },
  { text: 'theme             toggle lamplight' },
  { text: 'whoami            the human behind it' },
  { text: 'date              the stamp' },
  { text: 'clear · exit      housekeeping' },
]

export default function Terminal({ posts }: { posts: TermPost[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      if ((e.key === '~' || e.key === '`') && !typing) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('fn:terminal', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('fn:terminal', onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, open])

  const print = useCallback((out: Line[]) => {
    setLines((prev) => [...prev, ...out])
  }, [])

  const run = (raw: string) => {
    const line = raw.trim()
    print([{ text: `hussain@field-notes:~$ ${line}`, tone: 'cmd' }])
    if (!line) return
    setHistory((h) => [...h, line])
    setHistIdx(-1)

    const [name, ...args] = line.split(/\s+/)
    const arg = args.join(' ').toLowerCase()

    switch (name.toLowerCase()) {
      case 'help':
        print(HELP)
        break
      case 'ls':
        print(
          posts.map((p) => ({
            text: `№ ${p.n}  ${p.date}  ${p.type.padEnd(9)}  ${p.slug}`,
          })),
        )
        break
      case 'open': {
        const post = posts.find(
          (p) =>
            p.slug === arg ||
            p.n === arg.replace(/^№\s*/, '').padStart(2, '0') ||
            String(Number(arg)) === String(Number(p.n)),
        )
        if (post && arg) {
          print([{ text: `opening № ${post.n} — ${post.title}`, tone: 'dim' }])
          setOpen(false)
          router.push(post.permalink)
        } else {
          print([{ text: `no such entry: ${arg || '(none)'} — try 'ls'` }])
        }
        break
      }
      case 'go': {
        const routes: Record<string, string> = {
          feed: '/',
          home: '/',
          archive: '/archive',
          about: '/about',
          now: '/now',
          colophon: '/colophon',
        }
        if (routes[arg] !== undefined) {
          print([{ text: `→ ${arg}`, tone: 'dim' }])
          setOpen(false)
          router.push(routes[arg])
        } else {
          print([{ text: `unknown page: ${arg || '(none)'} — try 'help'` }])
        }
        break
      }
      case 'grep': {
        if (!arg) {
          print([{ text: 'usage: grep <term>' }])
          break
        }
        const hits = posts.filter((p) =>
          `${p.title} ${p.slug} ${p.type}`.toLowerCase().includes(arg),
        )
        print(
          hits.length > 0
            ? hits.map((p) => ({
                text: `№ ${p.n}  ${p.type.padEnd(9)}  ${p.slug}`,
              }))
            : [{ text: `no entries match '${arg}'`, tone: 'dim' as const }],
        )
        break
      }
      case 'theme': {
        const dusk = document.documentElement.dataset.theme === 'dusk'
        if (dusk) {
          delete document.documentElement.dataset.theme
        } else {
          document.documentElement.dataset.theme = 'dusk'
        }
        try {
          localStorage.setItem('fn-theme', dusk ? 'day' : 'dusk')
        } catch {
          /* private mode */
        }
        print([{ text: dusk ? 'daylight restored.' : 'lamplight on.', tone: 'accent' }])
        break
      }
      case 'whoami':
        print([
          { text: 'hussain naqvi — builds web things, keeps field notes.' },
          { text: 'somewhere between a git log and a diary.', tone: 'dim' },
        ])
        break
      case 'date': {
        const now = new Date()
        print([
          {
            text: now.toISOString().slice(0, 10).replaceAll('-', '·'),
          },
        ])
        break
      }
      case 'sudo':
        print([{ text: 'nice try.', tone: 'accent' }])
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        setOpen(false)
        break
      default:
        print([
          { text: `command not found: ${name} — try 'help'` },
        ])
    }
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((i) => {
        const next = i === -1 ? history.length - 1 : Math.max(0, i - 1)
        setValue(history[next] ?? '')
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((i) => {
        const next = i >= history.length - 1 ? -1 : i + 1
        setValue(next === -1 ? '' : (history[next] ?? ''))
        return next
      })
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="Site terminal"
      className="fixed inset-x-0 bottom-0 z-[90] border-t-2 border-accent bg-panel font-mono text-[0.8rem] leading-relaxed text-[#efe7d7] shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.6)]"
      style={{ animation: 'page-enter 0.3s var(--ease) both' }}
    >
      <div className="mx-auto max-w-4xl px-5">
        <div className="flex items-baseline justify-between gap-4 border-b border-[#efe7d7]/15 py-2">
          <span className="tracking-[0.08em] text-[#efe7d7]/60">
            FIELD-NOTES SHELL
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close terminal"
            className="cursor-pointer text-[#efe7d7]/60 transition-colors duration-300 ease-soft hover:text-[#efe7d7]"
          >
            esc ✕
          </button>
        </div>
        <div
          ref={scrollRef}
          className="max-h-[38vh] min-h-44 overflow-y-auto py-3"
        >
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.tone === 'dim'
                  ? 'text-[#efe7d7]/50'
                  : l.tone === 'accent'
                    ? 'text-accent'
                    : l.tone === 'cmd'
                      ? 'text-[#efe7d7]/80'
                      : 'text-[#efe7d7]'
              }
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {l.text}
            </p>
          ))}
        </div>
        <div className="flex items-baseline gap-2 border-t border-[#efe7d7]/15 py-3">
          <label htmlFor="fn-term-input" className="shrink-0 text-accent">
            hussain@field-notes:~$
          </label>
          <input
            id="fn-term-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onInputKey}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[#efe7d7] caret-accent outline-none placeholder:text-[#efe7d7]/30"
            placeholder="help"
          />
        </div>
      </div>
    </div>
  )
}
