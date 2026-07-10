import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, POST_TYPES, formatStamp } from '@/lib/posts'
import { getShipping } from '@/lib/github'
import { site } from '@/lib/site'
import tele from '@/components/Telemetry.module.css'

export const metadata: Metadata = {
  title: 'Now',
  description:
    'A personal telemetry board — what Hussain is building, reading, and chasing at the moment.',
}

const LAST_UPDATED = '2026·07·10'

function Cell({
  i,
  label,
  className = '',
  children,
}: {
  i: number
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={`${tele.cell} flex flex-col gap-4 bg-paper p-6 ${className}`}
      style={{ '--i': i } as React.CSSProperties}
    >
      <h2 className="meta-mono flex items-baseline justify-between gap-4">
        <span>{label}</span>
        <span aria-hidden="true" className="text-ink-faint">
          {String(i + 1).padStart(2, '0')}
        </span>
      </h2>
      <div className="flex-1">{children}</div>
    </section>
  )
}

export default async function NowPage() {
  const [latest] = getAllPosts()
  const shipping = await getShipping()

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div>
          <p className="meta-mono mb-4">Telemetry · a now page, Sivers-style</p>
          <h1
            className="font-display text-5xl leading-none tracking-tight md:text-6xl"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            Now<span className="text-accent">.</span>
          </h1>
        </div>
        <p className="meta-mono border border-line px-4 py-2 text-right leading-relaxed">
          Last updated
          <br />
          <span className="text-ink">{LAST_UPDATED}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
        <Cell i={0} label="Building" className="lg:col-span-4">
          <p
            className="font-display text-2xl italic leading-snug md:text-3xl"
            style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40' }}
          >
            hussain-field-notes — the site you are reading
          </p>
          <p className="mt-3 max-w-[52ch] text-ink-soft">
            One stream for projects, essays, poems, journal pages and travel
            notes. Printed matter, come alive.
          </p>
          <p className="meta-mono mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <span>Next.js 16</span>
            <span aria-hidden="true">·</span>
            <span>Velite MDX</span>
            <span aria-hidden="true">·</span>
            <span>framer-motion</span>
          </p>
        </Cell>

        <Cell i={1} label="Location" className="lg:col-span-2">
          <p
            className="font-display text-2xl leading-snug md:text-3xl"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            London, UK
          </p>
          <p className="meta-mono mt-3 leading-relaxed">
            51.5072° N · 0.1276° W
            <br />
            BST · UTC+1
          </p>
          <p className="meta-mono mt-4 normal-case tracking-normal text-ink-faint">
            Lahore on the horizon — LHR ⇄ LHE, eleven hours of sky.
          </p>
        </Cell>

        <Cell i={2} label="Job hunt" className="lg:col-span-3">
          <p className="flex items-center gap-3">
            <span className={tele.pulse} aria-hidden="true" />
            <span className="meta-mono text-accent-deep">
              Searching · open to work
            </span>
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-4">
            {[
              ['Applications', '23'],
              ['Replies', '06'],
              ['Interviews', '02'],
            ].map(([k, v]) => (
              <div key={k}>
                <dd
                  className="font-display text-4xl tabular-nums"
                  style={{ fontVariationSettings: '"opsz" 96' }}
                >
                  {v}
                </dd>
                <dt className="meta-mono mt-1 text-ink-faint">{k}</dt>
              </div>
            ))}
          </dl>
          <p className="meta-mono mt-5 normal-case tracking-normal text-ink-faint">
            applications out · interviews pending · morale holding
          </p>
        </Cell>

        <Cell i={3} label="Reading" className="lg:col-span-3">
          <p
            className="font-display text-2xl italic leading-snug"
            style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40' }}
          >
            The Design of Everyday Things
          </p>
          <p className="mt-1 text-ink-soft">Don Norman</p>
          <div className="mt-5">
            <div
              className="h-1 w-full bg-line"
              role="progressbar"
              aria-valuenow={148}
              aria-valuemin={0}
              aria-valuemax={288}
              aria-label="Reading progress: page 148 of 288"
            >
              <div className="h-full bg-ink-soft" style={{ width: '51%' }} />
            </div>
            <p className="meta-mono mt-2 flex justify-between">
              <span>p. 148 ⁄ 288</span>
              <span className="text-ink-faint">51%</span>
            </p>
          </div>
        </Cell>

        <Cell i={4} label="Last entry" className="lg:col-span-4">
          <p className="meta-mono mb-2">
            <span title={POST_TYPES[latest.type].label} aria-hidden="true">
              {POST_TYPES[latest.type].glyph}
            </span>{' '}
            {POST_TYPES[latest.type].label} · {formatStamp(latest.date)}
          </p>
          <Link
            href={latest.permalink}
            className="font-display text-2xl leading-snug transition-colors duration-300 ease-soft hover:text-accent-deep md:text-3xl"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            {latest.title}
          </Link>
          <p className="mt-3 max-w-[52ch] text-ink-soft">{latest.excerpt}</p>
        </Cell>

        <Cell i={5} label="Signal" className="lg:col-span-2">
          <ul className="meta-mono space-y-3 leading-relaxed">
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Caffeine</span>
              <span>Nominal</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Commits</span>
              <span>Daily</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Poems</span>
              <span>In margins</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Homesick</span>
              <span>Mildly</span>
            </li>
          </ul>
        </Cell>
              <Cell i={6} label="Shipping — live" className="lg:col-span-6">
          {shipping ? (
            <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
              <div>
                <p
                  className="font-display text-4xl tabular-nums"
                  style={{ fontVariationSettings: '"opsz" 96' }}
                >
                  {String(shipping.weekCommits).padStart(2, '0')}
                </p>
                <p className="meta-mono mt-1 text-ink-faint">
                  Commits · 7 days
                </p>
              </div>
              <ul className="meta-mono min-w-0 flex-1 space-y-2 normal-case tracking-normal">
                {shipping.pushes.map((push, i) => (
                  <li key={i} className="flex min-w-0 items-baseline gap-3">
                    <span className="shrink-0 text-accent-deep">
                      {push.repo}
                    </span>
                    <span className="truncate text-ink-soft">
                      {push.message}
                    </span>
                    <span className="ml-auto shrink-0 text-ink-faint">
                      {push.when}
                    </span>
                  </li>
                ))}
                {shipping.pushes.length === 0 && (
                  <li className="text-ink-faint">
                    a quiet week on the public record
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p className="meta-mono normal-case tracking-normal text-ink-faint">
              Telemetry offline — set your GitHub handle in{' '}
              <code className="font-mono">lib/site.ts</code> and this cell
              reports live pushes ({site.githubUser === 'your-handle'
                ? 'handle unset'
                : 'API unreachable'}
              ).
            </p>
          )}
        </Cell>
      </div>

      <p className="meta-mono mt-8 normal-case tracking-normal text-ink-faint">
        * Reading figures and job-hunt counts are placeholder telemetry —{' '}
        <em className="font-display italic">draft, rewrite me</em>. The last
        entry is live.
      </p>
    </div>
  )
}
