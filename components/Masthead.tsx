'use client'

import { motion, useReducedMotion } from 'framer-motion'
import InkHero from '@/components/InkHero'
import Parallax from '@/components/Parallax'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The front page's opening number: the rule draws itself across the
 * broadsheet, the kicker settles, the ink pours into the masthead, a
 * swash underlines it, and the intro sweeps in from the wings.
 */
export default function Masthead({ last }: { last: string }) {
  const reduced = useReducedMotion()

  const swoop = (x: number, delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x },
          animate: { opacity: 1, x: 0 },
          transition: {
            delay,
            type: 'spring' as const,
            stiffness: 60,
            damping: 15,
            mass: 0.9,
          },
        }

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 md:pt-14">
      {/* the top rule draws itself */}
      <motion.div
        aria-hidden="true"
        className="origin-left border-t-2 border-ink"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <motion.p
        className="meta-mono mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
        initial={reduced ? false : 'hidden'}
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
        }}
      >
        {['The feed — newest first', 'projects · essays · poetry · journal · adventures', 'London — MMXXVI'].map(
          (text, i) => (
            <motion.span
              key={i}
              className={i === 1 ? 'hidden text-ink-faint lg:inline' : undefined}
              variants={{
                hidden: { opacity: 0, y: -10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              {text}
            </motion.span>
          ),
        )}
      </motion.p>

      <Parallax speed={-0.07}>
        <InkHero />
        {/* the swash — one calligraphic stroke of the accent, drawn late */}
        <svg
          aria-hidden="true"
          viewBox="0 0 820 44"
          fill="none"
          className="ml-[14%] mt-1 w-[min(58%,560px)] md:ml-[20%]"
        >
          <path
            d="M8 30 C 150 42, 320 6, 470 18 S 740 30, 806 10"
            stroke="var(--color-accent)"
            strokeWidth="3.2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            className="swash-draw"
          />
        </svg>
      </Parallax>

      <div className="mt-8 pb-6 md:mt-12 md:grid md:grid-cols-12 md:gap-x-8 md:pb-8">
        <motion.div className="md:col-span-3" {...swoop(-48, 0.55)}>
          <Parallax speed={0.05}>
            <p className="meta-mono pt-2 text-ink-faint">
              № 01 → {last}
              <br />
              one stream, numbered
              <br />
              like a ledger
            </p>
          </Parallax>
        </motion.div>
        <motion.p
          className="prose-fn mt-6 text-lg md:col-span-6 md:col-start-6 md:mt-0"
          {...swoop(48, 0.7)}
        >
          I&apos;m Hussain — I build things, and I write down what building
          them does to me. Projects, essays, poems, journal pages and travel
          notes all land here, in one stream: the work, and what the work
          costs.
        </motion.p>
      </div>
    </section>
  )
}
