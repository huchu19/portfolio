import type { Metadata } from 'next'
import Link from 'next/link'
import Urdu from '@/components/typography/Urdu'
import { getAllFragments, getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Guide',
  description:
    'The making of Khwabon ka Bagh — the brief, the critique loop, the decisions, and what the screenshots caught.',
}

/* eslint-disable @next/next/no-img-element */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="panel flex flex-col justify-between"
      style={{ padding: 'calc(var(--u) * 2)', minHeight: 96 }}
    >
      <span className="display" style={{ fontSize: 'clamp(26px, 3vw, 40px)', color: 'var(--color-fg)' }}>
        {value}
      </span>
      <span className="mono-label" style={{ fontSize: 10.5 }}>{label}</span>
    </div>
  )
}

function Shot({
  src,
  caption,
  width = 1200,
  height = 750,
}: {
  src: string
  caption: string
  width?: number
  height?: number
}) {
  return (
    <figure style={{ margin: 0 }}>
      <img
        src={src}
        alt={caption}
        width={width}
        height={height}
        className="w-full rounded-lg"
        style={{ border: '1px solid var(--color-line)' }}
      />
      <figcaption className="mono-label" style={{ fontSize: 10.5, marginTop: 'var(--u)' }}>
        {caption}
      </figcaption>
    </figure>
  )
}

export default function GuidePage() {
  const posts = getAllPosts()
  const fragments = getAllFragments()
  const words = posts.reduce((n, p) => n + p.metadata.wordCount, 0)

  return (
    <article
      className="mx-auto w-full"
      style={{ maxWidth: 760, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 12)' }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
        Guide — the making of
      </p>
      <h1 className="display" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', lineHeight: 1.05 }}>
        How this <em>garden</em> was grown
      </h1>

      <div style={{ marginTop: 'calc(var(--u) * 4)', maxWidth: 520 }}>
        <Urdu size={22}>{site.ghazalUr}</Urdu>
        <p style={{ marginTop: 'var(--u)', fontSize: 14, color: 'var(--color-fg-soft)' }}>{site.ghazalEn}</p>
      </div>

      {/* the numbers, on fibonacci-proportioned panels */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'calc(var(--u) * 2)',
          marginTop: 'calc(var(--u) * 6)',
        }}
      >
        <Stat value={String(posts.length)} label="posts" />
        <Stat value={String(fragments.length)} label="fragments" />
        <Stat value={words.toLocaleString('en-GB')} label="words (drafts included)" />
        <Stat value="8" label="build phases" />
        <Stat value="50+" label="critique screenshots" />
      </div>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 8)' }}>
        <p className="draft-note">
          Draft — rewrite me. This page describes Hussain&apos;s process, but Claude wrote the
          prose; the facts are real, the voice is borrowed.
        </p>

        <h2>The brief</h2>
        <p>
          Everything starts from a design constitution — <code>VISION.md</code> — written before
          the first component: a universe, not a portfolio. Dark ground the color of a banked
          fire, ember used so sparingly it still means something, Urdu set only ever in
          Nastaliq, every proportion derived from φ rather than eyeballed, and a standing
          instruction to critique every screen like a hostile art director. The geometry
          itself is explained in the <Link href="/colophon">colophon</Link>; this page is about
          the process.
        </p>

        <h2>The critique loop</h2>
        <p>
          The build borrows its method from the FABLE 25 experiment: after every phase, the
          site is rendered in headless Chrome at desktop and mobile sizes, the screenshots are
          read back like a stranger&apos;s work, and what the pixels admit gets fixed. Code
          review can&apos;t see a widow, a muddy button, or a spiral chopped into dashes —
          only the rendered page tells the truth.
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: '1fr 1fr', gap: 'calc(var(--u) * 2)', marginTop: 'calc(var(--u) * 4)' }}
      >
        <Shot src="/media/guide/home-desktop.jpg" caption="pass 1 — first render of the golden grid" />
        <Shot src="/media/guide/home-desktop-v3.jpg" caption="pass 3 — after the critique fixes landed" />
      </div>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 4)' }}>
        <p>
          The loop&apos;s best catch: the golden spiral rendered as broken dashes.{' '}
          <code>vector-effect: non-scaling-stroke</code> makes the browser compute{' '}
          <code>stroke-dasharray</code> in screen pixels, so the self-drawing animation chopped
          the path into 34-pixel segments. No linter flags that. A screenshot does. (The same
          bug class tried to come back months later in the adventure route arc — the log
          remembered, so it lasted one pass.)
        </p>

        <h2>Travelling the spiral</h2>
        <p>
          The homepage is a 13×8 fibonacci rectangle you can travel: scrolling zooms the
          viewport continuously through the construction&apos;s squares — 8², 5², 3², 2² — with
          one smoothed progress value driving the whole camera. The first shipped version was
          destination-based zoom with hand-rolled wheel handling; rebuilding it on a sticky
          track let native scrolling do everything the custom code did, so the custom code was
          deleted. Mobile and <code>prefers-reduced-motion</code> get the resting grid,
          untouched.
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: '1fr 1fr', gap: 'calc(var(--u) * 2)', marginTop: 'calc(var(--u) * 4)' }}
      >
        <Shot src="/media/guide/zoom-stop1.jpg" caption="scroll ≈ 25% — inside the 8² intro square" />
        <Shot src="/media/guide/zoom-stop2.jpg" caption="scroll ≈ 50% — the 5² feed fills the viewport" />
      </div>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 4)' }}>
        <h2>Seeded growth</h2>
        <p>
          Nothing decorative here is random. A post&apos;s slug is hashed into a seed, and the
          seed grows its artwork: phyllotaxis fields placed by the golden angle (360°/φ²) for
          the covers and Open Graph cards, flow-field strokes for the essays, and a small moss
          garden in the left margin that grows as you read — one ember bloom opens only if you
          finish. Same slug, same garden, forever.
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: '1fr 1fr', gap: 'calc(var(--u) * 2)', marginTop: 'calc(var(--u) * 4)' }}
      >
        <Shot src="/media/guide/og-essay-v2.jpg" caption="an Open Graph card, grown from its slug" width={1200} height={630} />
        <Shot src="/media/guide/garden-end.jpg" caption="the reading garden, fully grown at the end of an essay" />
      </div>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 4)' }}>
        <h2>Decisions worth remembering</h2>
        <ul>
          <li>
            Dark is the identity, light is a skin — the toggle overrides tokens, never
            components.
          </li>
          <li>
            Nastaliq sits in <em>every</em> font stack ahead of the system fallback, so stray
            Urdu can never render in a Latin face.
          </li>
          <li>
            The feed lives on the homepage inside the 5² square — a separate index page would
            make the grid a poster instead of a place.
          </li>
          <li>
            Fragments are a second collection with almost no frontmatter, because friction is
            what kills micro-writing.
          </li>
          <li>
            Ember stays under a tenth of any screen. Fire you ration is fire that still burns.
          </li>
          <li>
            Every animation defers to <code>prefers-reduced-motion</code> — verified by
            screenshot, not by promise.
          </li>
        </ul>

        <h2>What remains</h2>
        <p>
          The prose marked <em>draft — rewrite me</em> is still Claude&apos;s phrasing awaiting
          Hussain&apos;s voice; the recitation player is wired and waiting for real audio of
          the ghazals; and the real domain still needs to replace the placeholder before the
          RSS and Open Graph URLs are honest. A garden is never finished — that is rather the
          point.
        </p>

        <p>
          <Link href="/">← Back to the garden</Link>
        </p>
      </div>
    </article>
  )
}
