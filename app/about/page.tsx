import type { Metadata } from 'next'
import Link from 'next/link'
import Urdu from '@/components/typography/Urdu'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Software engineer, Urdu poet, delusional optimist — who this universe belongs to.',
}

/* draft: rewrite me — the shape and register are right; make the details yours */
export default function AboutPage() {
  return (
    <article
      className="mx-auto w-full"
      style={{ maxWidth: 720, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 12)' }}
    >
      <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
        About
      </p>
      <h1 className="display" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', lineHeight: 1.05 }}>
        So — <em>what&apos;s your deal?</em>
      </h1>

      <div className="prose" style={{ marginTop: 'calc(var(--u) * 6)' }}>
        <p>
          I&apos;m Hussain. I&apos;m twenty-two, I write software, and I write ghazals, and I
          have stopped apologising for the fact that those are the same activity performed
          at different temperatures. Both are attempts to make something precise enough to
          hold feeling. The compiler is just a stricter editor than the ear.
        </p>
        <p>
          I grew up between Karachi and London, which means I grew up bilingual in more than
          language — two ideas of home, two volumes of traffic, two ways of making tea that
          each side considers non-negotiable. My phone wallpaper is Nastaliq script over
          mountains. My browser tabs are Next.js documentation. Neither of these is ironic.
        </p>
        <p>
          The code: I build for the web — an education platform that taught me more than it
          taught its students, a headless storefront for a toy shop, this site. I like
          TypeScript because it argues back and React because it doesn&apos;t pretend the
          world is simple. I am currently looking for a team that builds things it is proud
          of; if that&apos;s you, the door is <a href={`mailto:${site.email}`}>right here</a>.
        </p>

        <blockquote>
          Even if this garden of dreams keeps burning — from ashes too, a new revolution is
          born.
        </blockquote>

        <p>
          The rest of me, in no particular order, because there is no particular order:
          Berserk taught me that you keep walking through the fire, and Vagabond taught me
          the fire is mostly in your own head. Iqbal and Camus are, in my personal library,
          shelved together — one asks you to be infinite, the other asks you to imagine
          Sisyphus happy, and on a good day I can do both before lunch. My faith is mine;
          I earned it the slow way, by asking every question I was told not to ask and
          finding the answers held.
        </p>
        <p>
          And Barça. I need you to understand this is not about football. A club that
          insists on playing beautifully when winning ugly would be easier — that presses
          from the front at 3-1 down because the idea matters more than the scoreline —
          that is a philosophy with a stadium attached. I write ghazals instead of grinding
          LeetCode for the same reason Barça plays out from the back. It might not be
          optimal. It is, however, the point.
        </p>
      </div>

      {/* the bilingual moment — who I am in my mother tongue */}
      <section
        aria-label="In Urdu"
        style={{
          marginTop: 'calc(var(--u) * 8)',
          paddingTop: 'calc(var(--u) * 6)',
          borderTop: '1px solid var(--color-void-line)',
        }}
      >
        {/* draft: rewrite me — a paragraph in your own Urdu, not a translation exercise */}
        <Urdu size="clamp(20px, 2.4vw, 26px)">
          اردو میری ماں کی زبان ہے — خواب اسی میں آتے ہیں، حساب کتاب انگریزی میں ہوتا ہے۔
          کوڈ دن کو لکھتا ہوں، شعر رات کو، اور دونوں میں ایک ہی تمنا ہے —
          کہ کچھ ایسا بن جائے جو پہلے نہیں تھا۔
        </Urdu>
        <p style={{ marginTop: 'calc(var(--u) * 3)', fontSize: 14, color: 'var(--color-ash)', maxWidth: '58ch' }}>
          Urdu is my mother&apos;s tongue — the dreams arrive in it; the accounting happens
          in English. I write code by day and couplets by night, and both carry the same
          desire: that something should come to exist which didn&apos;t before.
        </p>
      </section>

      <p className="mono-label" style={{ marginTop: 'calc(var(--u) * 8)' }}>
        <Link href="/now" className="transition-colors hover:text-(--color-bone)">
          What I&apos;m doing now →
        </Link>
      </p>
    </article>
  )
}
