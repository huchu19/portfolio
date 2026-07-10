import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'How this site is made — type, ink, paper, stack, and the FABLE 25 process behind it.',
}

const TYPE_SPEC: [string, string][] = [
  ['Display', 'Fraunces — variable · opsz / SOFT / WONK'],
  ['Body', 'Space Grotesk'],
  ['Report', 'IBM Plex Mono — tabular figures'],
  ['Measure', '66ch reading columns'],
  ['Unit', '8px — every gap a multiple'],
  ['Easing', 'cubic-bezier(.22, 1, .36, 1) — nothing linear'],
]

const INKS: { name: string; hex: string; cls: string; border?: boolean }[] = [
  { name: 'paper', hex: '#F4EFE6', cls: 'bg-paper', border: true },
  { name: 'paper-deep', hex: '#EDE4D2', cls: 'bg-paper-deep', border: true },
  { name: 'line', hex: '#D9CFBE', cls: 'bg-line' },
  { name: 'ink', hex: '#201B14', cls: 'bg-ink' },
  { name: 'ink-soft', hex: '#5C5344', cls: 'bg-ink-soft' },
  { name: 'ink-faint', hex: '#8D8271', cls: 'bg-ink-faint' },
  { name: 'accent', hex: '#BC4A18', cls: 'bg-accent' },
  { name: 'accent-deep', hex: '#8F3610', cls: 'bg-accent-deep' },
]

function Sect({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rule grid gap-x-16 gap-y-4 py-10 md:grid-cols-[10rem_minmax(0,60ch)]">
      <h2 className="meta-mono md:pt-1 md:text-right">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <header className="mb-12">
        <p className="meta-mono mb-4">Every site documents itself</p>
        <h1
          className="font-display text-5xl leading-none tracking-tight md:text-6xl"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Colophon<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg text-ink-soft">
          In old books, the colophon was the page where the printer confessed
          how the thing was made. This is that page — the site describing
          itself, which is the closest a website gets to a mirror.
        </p>
      </header>

      <Sect title="Type">
        <dl className="space-y-3">
          {TYPE_SPEC.map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-3">
              <dt className="meta-mono shrink-0">{k}</dt>
              <span
                aria-hidden="true"
                className="min-w-8 flex-1 border-b border-dotted border-line"
              />
              <dd className="meta-mono shrink-0 text-right normal-case tracking-normal text-ink">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-ink-soft">
          Fraunces speaks, Space Grotesk reads, and IBM Plex Mono files the
          reports. Any page here is those three voices taking turns.
        </p>
      </Sect>

      <Sect title="Ink & paper">
        <ul className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-8 sm:gap-x-3">
          {INKS.map((ink) => (
            <li key={ink.name} className="min-w-0">
              <span
                aria-hidden="true"
                className={`block h-10 w-full ${ink.cls} ${
                  ink.border ? 'border border-line' : ''
                }`}
              />
              <span className="meta-mono mt-2 block truncate text-[0.62rem] normal-case tracking-normal text-ink-faint">
                {ink.name}
                <br />
                {ink.hex}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink-soft">
          Warm bone paper, warm near-black ink, terracotta used like a scalpel
          — about five touches per screen, never a spill. The film grain over
          everything is a single SVG turbulence filter at four percent, because
          paper is never perfectly clean.
        </p>
      </Sect>

      <Sect title="Stack">
        <p className="text-ink-soft">
          Built with{' '}
          <a
            href="https://nextjs.org"
            className="text-accent-deep underline decoration-line underline-offset-[3px] transition-colors duration-300 ease-soft hover:decoration-accent"
          >
            Next.js
          </a>{' '}
          (App Router) and TypeScript; styled with Tailwind CSS 4 on top of a
          single token sheet; content is MDX compiled by Velite; motion by
          framer-motion and a great deal of restraint. No CMS, no analytics, no
          cookie banner — a text file becomes a page, the end.
        </p>
      </Sect>

      <Sect title="Process">
        <p className="text-ink-soft">
          Designed and built in Claude Code following the{' '}
          <a
            href="https://fable-25.netlify.app/guide/"
            className="text-accent-deep underline decoration-line underline-offset-[3px] transition-colors duration-300 ease-soft hover:decoration-accent"
          >
            FABLE 25 process
          </a>
          : a written design constitution, parallel builders each owning a
          surface, and three screenshot-critique passes per surface — every
          page argued with by a hostile design director before it shipped.
          Deviations from the constitution are bugs.
        </p>
      </Sect>

      <p
        className="rule pt-10 text-center font-display text-xl italic text-ink-soft"
        style={{ fontVariationSettings: '"opsz" 60, "SOFT" 50' }}
      >
        No pixels were eyeballed — every one is a multiple of eight.
      </p>
    </div>
  )
}
