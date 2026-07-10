import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Hussain Naqvi — builds web things, writes poetry and journal entries, moves between Lahore and London.',
}

const opsz144 = { fontVariationSettings: '"opsz" 144' }
const opsz144Soft = { fontVariationSettings: '"opsz" 144, "SOFT" 60' }

function Section({
  no,
  title,
  children,
}: {
  no: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rule grid gap-x-16 gap-y-4 py-12 md:grid-cols-[10rem_minmax(0,66ch)]">
      <div className="md:text-right">
        <span
          aria-hidden="true"
          className="entry-no block text-6xl leading-none md:text-7xl"
        >
          {no}
        </span>
        <h2 className="meta-mono mt-2">{title}</h2>
      </div>
      <div className="space-y-5 text-[1.0625rem] leading-[1.7] text-ink">
        {children}
      </div>
    </section>
  )
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    'text-accent-deep underline decoration-line underline-offset-[3px] transition-colors duration-300 ease-soft hover:decoration-accent'
  return href.startsWith('/') ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-8">
        <p className="meta-mono mb-6">
          About · the human behind it ·{' '}
          <em className="font-display normal-case italic tracking-normal text-ink-faint">
            draft — rewrite me
          </em>
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
          style={opsz144}
        >
          Somewhere between
          <br />
          a git log <span className="font-light text-ink-faint">&amp;</span> a
          diary<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-[46ch] text-lg text-ink-soft">
          That&rsquo;s where I live, professionally speaking. I&rsquo;m Hussain
          Naqvi. I build things for the web, and I keep field notes on what the
          building does to me.
        </p>
      </header>

      <Section no="01" title="The short version">
        <p>
          I&rsquo;m a developer who writes, or a writer who ships — it depends
          on the hour. The shipping side has produced{' '}
          <strong className="font-medium">TiflToys</strong>,{' '}
          <strong className="font-medium">EduNexus</strong>,{' '}
          <strong className="font-medium">Bamboo</strong>, and{' '}
          <strong className="font-medium">JobHunter</strong> — the last one
          built while doing the very thing it&rsquo;s named after, which felt
          less like irony and more like method acting.
        </p>
        <p>
          The writing side produces the rest of this site: essays about what
          the projects taught me, journal pages, travel notes, and poems —
          because a changelog can&rsquo;t hold everything, and I refuse to put
          feelings in a commit message.
        </p>
      </Section>

      <Section no="02" title="Two cities">
        <p>
          Lahore raised me; London is where I currently take my walks. I move
          between them often enough that both airports feel like waiting rooms
          of the same house. One city taught me that hospitality is a
          load-bearing wall; the other taught me the exact pace at which a
          person should pass a stranger on an escalator.
        </p>
        <p>
          The commute between them is eleven hours of sky, and it turns out to
          be where most of my{' '}
          <A href="/writing/on-leaving-comfort">poetry</A> gets written.
          Departure lounges are underrated studies.
        </p>
      </Section>

      <figure
        aria-hidden="true"
        className="rule py-12 md:py-16"
      >
        <blockquote
          className="mx-auto max-w-3xl border-l-2 border-accent pl-6 font-display text-3xl italic leading-snug text-ink md:pl-8 md:text-4xl"
          style={opsz144Soft}
        >
          I&rsquo;m from Lahore the way a book is from its first printing —
          London is just the edition I&rsquo;m currently in.
        </blockquote>
      </figure>

      <Section no="03" title="The building">
        <p>
          I like the web because it&rsquo;s the only medium where a thing can
          be a store, a classroom, a letter, and a stage without changing
          costume. EduNexus was my longest argument with myself about what
          software should <em>believe</em>; TiflToys taught me that commerce is
          mostly typography with a checkout at the end; JobHunter taught me to
          build the tool I was too tired to wish for.
        </p>
        <p>
          My taste runs to warm paper over dark mode, hairlines over cards,
          and prose over dashboards — this site being the confession.
        </p>
      </Section>

      <Section no="04" title="Right now">
        <p>
          The honest status: job-hunting while building, which is a polite way
          of saying I write cover letters in the morning and code in the
          evening so the day nets out to progress. If you&rsquo;re hiring
          people who ship and can also spell, the door is open.
        </p>
        <p>
          The live version of this paragraph is on the{' '}
          <A href="/now">now page</A>; the complete paper trail is in the{' '}
          <A href="/archive">archive</A>. Or just write to me —{' '}
          <A href="mailto:hussainnaqvi2004@gmail.com">
            hussainnaqvi2004@gmail.com
          </A>
          .
        </p>
      </Section>

      <p
        className="rule py-12 text-right font-display text-3xl italic text-ink-soft"
        style={opsz144Soft}
      >
        — H<span className="text-accent">.</span>
      </p>
    </div>
  )
}
