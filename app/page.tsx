import Link from 'next/link'
import { Suspense } from 'react'
import Feed from '@/components/feed/Feed'
import GhazalLine from '@/components/golden/GhazalLine'
import SpiralOverlay from '@/components/golden/SpiralOverlay'
import ZoomStage from '@/components/golden/ZoomStage'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { getFeed, getAllPosts, toFeedItem } from '@/lib/posts'
import { now } from '@/lib/now'
import { site } from '@/lib/site'

const GHAZAL_LINES = [
  'خوابوں کا یہ باغ جلتا بھی رہے تو کیا',
  'راکھ سے بھی ایک نیا انقلاب پیدا ہوتا ہے',
]

export default function HomePage() {
  const items = getFeed().map(toFeedItem)
  const featured = getAllPosts().find((p) => p.type === 'project')

  return (
    <div style={{ padding: 'calc(var(--u) * 3)' }}>
      <ScrollProgress />
      <ZoomStage>
        <SpiralOverlay />

        {/* 8² — the intro rectangle */}
        <section className="cell-intro flex flex-col justify-center" style={{ padding: 'calc(var(--u) * 4)' }}>
          <p className="mono-label" style={{ marginBottom: 'calc(var(--u) * 2)' }}>
            Khwabon ka Bagh — a universe, not a portfolio
          </p>
          <h1 className="display" style={{ fontSize: 'clamp(52px, 7.5vw, 112px)', lineHeight: 1 }}>
            Hussain
            <br />
            <em>Naqvi</em>
          </h1>
          <div style={{ marginTop: 'calc(var(--u) * 4)', maxWidth: 520 }}>
            <GhazalLine lines={GHAZAL_LINES} />
            <p style={{ marginTop: 'var(--u)', fontSize: 14, color: 'var(--color-ash)', maxWidth: '44ch' }}>
              {site.ghazalEn}
            </p>
          </div>
          <p
            className="mono-label"
            style={{ marginTop: 'calc(var(--u) * 5)', color: 'var(--color-bone)', fontSize: 13 }}
          >
            Software engineer<span style={{ color: 'var(--color-ember)' }}> · </span>
            Urdu poet<span style={{ color: 'var(--color-ember)' }}> · </span>
            Delusional optimist
          </p>
        </section>

        {/* 5² — the feed */}
        <section className="cell-feed flex flex-col" aria-label="Feed" style={{ padding: 'calc(var(--u) * 2)' }}>
          <Suspense fallback={null}>
            <Feed items={items} />
          </Suspense>
        </section>

        {/* 2×1 — quick links */}
        <nav className="cell-quick flex flex-wrap items-center" aria-label="Quick links" style={{ gap: 'calc(var(--u) * 2)', padding: 'calc(var(--u) * 2)' }}>
          {[
            ['About', '/about'],
            ['Archive', '/archive'],
            ['Colophon', '/colophon'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="mono-label transition-colors hover:text-(--color-bone)">
              {label}
            </Link>
          ))}
        </nav>

        {/* 2² — /now telemetry */}
        <Link href="/now" className="cell-now panel flex flex-col justify-between overflow-hidden" style={{ padding: 'calc(var(--u) * 2)' }}>
          <div className="mono-label" style={{ color: 'var(--color-ember)' }}>Now</div>
          <div className="flex flex-col gap-1" style={{ fontSize: 12.5, color: 'var(--color-ash)' }}>
            <span className="line-clamp-1">
              <span style={{ color: 'var(--color-bone)' }}>Building</span> {now.building[0].name}
            </span>
            <span className="line-clamp-1">
              <span style={{ color: 'var(--color-bone)' }}>Reading</span> {now.reading.title}
            </span>
            <span className="line-clamp-1">{now.location}</span>
          </div>
        </Link>

        {/* 3² — featured */}
        {featured && (
          <Link href={featured.permalink} className="cell-featured panel flex flex-col justify-between overflow-hidden" style={{ padding: 'calc(var(--u) * 3)', borderLeft: '2px solid var(--color-ember)' }}>
            <div>
              <div className="mono-label" style={{ color: 'var(--color-ember)', marginBottom: 'var(--u)' }}>
                Featured
              </div>
              <h2 className="display line-clamp-3" style={{ fontSize: 'clamp(20px, 1.8vw, 28px)' }}>
                {featured.title}
              </h2>
            </div>
            <p className="line-clamp-2" style={{ fontSize: 13.5, color: 'var(--color-ash)' }}>
              {featured.excerpt}
            </p>
          </Link>
        )}
      </ZoomStage>
    </div>
  )
}
