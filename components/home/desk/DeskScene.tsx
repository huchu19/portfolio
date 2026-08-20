import Section from '@/components/home/Section'
import WallScene from './WallScene'
import { computeWallLayout } from '@/lib/wall'
import type { Post } from '@/lib/posts'
import type { Shipping } from '@/lib/github'

/**
 * The literal desk. Everything below the ghazal was always "the desk" in
 * name (see Masthead's own comment) — this is where that stops being
 * abstract. Layout is computed here, server-side, so every wall object's
 * position exists in the HTML before any client JS runs.
 */
export default function DeskScene({ posts, shipping }: { posts: Post[]; shipping: Shipping | null }) {
  const layout = computeWallLayout(posts)

  return (
    <Section label="The desk" style={{ paddingBlock: 'calc(var(--u) * 8)' }}>
      <p className="mono-label" style={{ color: 'var(--color-accent)' }}>
        The desk
      </p>
      <h2
        className="display"
        style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          marginTop: 'var(--u)',
          marginBottom: 'calc(var(--u) * 4)',
        }}
      >
        Everything on the wall is a door
      </h2>
      <WallScene layout={layout} shipping={shipping} />
    </Section>
  )
}
