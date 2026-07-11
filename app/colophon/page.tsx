import type { Metadata } from 'next'
import Link from 'next/link'
import { PHI } from '@/lib/golden'

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How this site was made — the ratios, the tools, the thinking.',
}

export default function ColophonPage() {
  return (
    <article
      className="mx-auto w-full"
      style={{ maxWidth: 720, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 12)' }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
        Colophon
      </p>
      <h1 className="display" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)' }}>
        How this <em>universe</em> holds together
      </h1>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 6)' }}>
        <h2>The geometry</h2>
        <p>
          The construction lines you can see faintly behind every page are not a texture.
          They are a real golden-ratio subdivision — a 13×8 fibonacci rectangle cut into
          squares of 8, 5, 3, 2, 1, 1, computed at render time from φ ≈{' '}
          <code>{PHI.toFixed(10)}</code> in{' '}
          <code>lib/golden.ts</code>. The homepage grid, the spiral drawn over it, and the
          proportions of the feed panels all come from the same arithmetic. The spiral is
          the frame of the house, left showing through the walls.
        </p>

        <h2>The stack</h2>
        <p>
          Next.js (App Router) with TypeScript. Tailwind CSS v4 over a hand-written token
          system. Content is MDX compiled by Velite into two collections — posts and
          fragments. Motion is Framer Motion plus plain CSS, every transition on{' '}
          <code>cubic-bezier(.22,1,.36,1)</code>, all of it deferring to{' '}
          <code>prefers-reduced-motion</code>. Deployed on Vercel.
        </p>
        <p>
          Type: Instrument Serif for display, Inter for body, Geist Mono for the machines,
          and Noto Nastaliq Urdu for the mother tongue — loaded lazily, rendered
          right-to-left, and never, under any circumstances, substituted with a Latin face.
        </p>

        <h2>The process</h2>
        <p>
          The site was rebuilt in one long night by me and Claude (Fable 5, via Claude
          Code), working from a design constitution called <code>VISION.md</code> — palette,
          ratios, non-negotiable rules, and a standing instruction to critique every screen
          like a hostile art director. The previous version of this site was warm paper and
          postal stamps. It was lovely and it was not mine. This one is dark ground and
          ember, precision and rawness — which is closer to the truth.
        </p>

        <h2>The philosophy</h2>
        <p>
          Iqbal for the ambition, Camus for the mornings it doesn&apos;t work, Musashi for
          the discipline, Barça for the insistence that beautiful and effective are not
          opposites. Everything here — the golden structure, the bilingual text, the
          fragments between the essays — follows one rule: choose the beautiful option over
          the safe one.
        </p>

        <p>
          <Link href="/">← Back to the garden</Link>
        </p>
      </div>
    </article>
  )
}
