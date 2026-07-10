'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { entryNumber, formatDate, type Post, type PostType } from '@/lib/posts'
import FilterBar from './FilterBar'
import PostCard from './PostCard'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  posts: Post[]
  initialType: PostType | null
  verses: Record<string, string>
}

export default function Feed({ posts, initialType, verses }: Props) {
  const [type, setTypeState] = useState<PostType | null>(initialType)
  const reduced = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const [mark, setMark] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c: Partial<Record<PostType, number>> = {}
    for (const p of posts) c[p.type] = (c[p.type] ?? 0) + 1
    return c
  }, [posts])

  const filtered = type ? posts.filter((p) => p.type === type) : posts
  const oldest = posts[posts.length - 1]
  const total = String(posts.length).padStart(2, '0')

  const setType = (next: PostType | null) => {
    setTypeState(next)
    // sync the URL without a server round-trip; hard loads of
    // /?type=… arrive pre-filtered via the server page.
    window.history.replaceState(null, '', next ? `/?type=${next}` : '/')
  }

  /* the ledger bookmark — which entry is crossing the page's midline */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-no]'))
    if (items.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMark((e.target as HTMLElement).dataset.no ?? null)
          }
        }
      },
      { rootMargin: '-42% 0px -42% 0px' },
    )
    for (const el of items) io.observe(el)
    return () => io.disconnect()
  }, [filtered])

  return (
    <section aria-label="All entries" className="mx-auto max-w-6xl px-6">
      <FilterBar
        active={type}
        counts={counts}
        total={posts.length}
        onChange={setType}
      />

      <p role="status" className="sr-only">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} shown
      </p>

      <ul ref={listRef}>
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((post, i) => (
            <motion.li
              key={post.slug}
              data-no={entryNumber(post)}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -14 }}
              transition={{
                duration: 0.45,
                ease: EASE,
                delay: (i % 3) * 0.07,
              }}
              className="rule"
            >
              {/* each sheet swoops onto the desk from an alternating wing */}
              <motion.div
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0,
                        x: i % 2 === 0 ? -64 : 64,
                        rotate: i % 2 === 0 ? -1.4 : 1.4,
                      }
                }
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{
                  type: 'spring',
                  stiffness: 55,
                  damping: 14,
                  mass: 0.9,
                }}
              >
                <PostCard post={post} verse={verses[post.slug]} />
              </motion.div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {filtered.length === 0 && (
        <p className="rule py-16 text-center font-display italic text-xl text-ink-soft">
          Nothing filed here yet — the ledger has room.
        </p>
      )}

      <p className="rule meta-mono pb-16 pt-6 text-center text-ink-faint">
        — end of the ledger · № 01 was filed {oldest && formatDate(oldest.date)}{' '}
        —
      </p>

      {/* the bookmark riding the outer margin */}
      <AnimatePresence>
        {mark && (
          <motion.p
            key="ledger-mark"
            aria-hidden="true"
            className="meta-mono fixed bottom-8 right-6 z-40 hidden border border-line bg-paper px-3 py-2 md:block"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="entry-no normal-case tracking-normal">№</span>{' '}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={mark}
                className="inline-block text-ink"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {mark}
              </motion.span>
            </AnimatePresence>{' '}
            <span className="text-ink-faint">/ {total}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
