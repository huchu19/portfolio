import { Suspense } from 'react'
import Feed from '@/components/feed/Feed'
import EntryLedger from '@/components/feed/EntryLedger'
import Masthead from '@/components/home/Masthead'
import DeskBand from '@/components/home/DeskBand'
import FragmentStrip from '@/components/home/FragmentStrip'
import Invitation from '@/components/home/Invitation'
import Section from '@/components/home/Section'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { getFeed, getAllFragments, toFeedItem } from '@/lib/posts'
import { getShipping } from '@/lib/github'

/**
 * The descent. Five sections, each one carrying something the section above
 * it did not — the previous homepage spent its entire scroll budget zooming
 * around a single viewport-sized grid, so scrolling revealed nothing new.
 */
export default async function HomePage() {
  const items = getFeed().map(toFeedItem)
  const fragments = getAllFragments().map(toFeedItem)
  const shipping = await getShipping()

  return (
    <div className="descent">
      <ScrollProgress />

      <Masthead />

      <Section label="Feed" style={{ paddingBlock: 'calc(var(--u) * 8)' }}>
        <div style={{ marginBottom: 'calc(var(--u) * 4)' }}>
          <p className="mono-label" style={{ color: 'var(--color-accent)' }}>
            The work
          </p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginTop: 'var(--u)' }}
          >
            Everything, newest first
          </h2>
        </div>

        <div className="feed-with-ledger">
          <Suspense fallback={null}>
            <EntryLedger total={items.length} />
          </Suspense>
          <Suspense fallback={null}>
            <Feed items={items} />
          </Suspense>
        </div>
      </Section>

      <DeskBand shipping={shipping} />

      <FragmentStrip items={fragments} />

      <Invitation />
    </div>
  )
}
