import Link from 'next/link'
import type { Shipping } from '@/lib/github'
import StudioIllustration from './StudioIllustration'
import StudioProjectPins from './StudioProjectPins'
import type { StudioPost } from './types'

const PROJECT_ORDER = ['jobhunter', 'edunexus', 'bamboo', 'tifltoys']

export default function StudioHero({ posts, shipping }: { posts: StudioPost[]; shipping: Shipping | null }) {
  const projects = posts
    .filter((post) => post.type === 'project')
    .sort((a, b) => PROJECT_ORDER.findIndex((name) => a.slug.includes(name)) - PROJECT_ORDER.findIndex((name) => b.slug.includes(name)))
    .slice(0, 4)

  const lastPush = shipping?.pushes[0]

  return (
    <section className="studio-hero" aria-labelledby="studio-title">
      <div className="studio-stage">
        <StudioIllustration />

        <div className="studio-identity">
          <p className="studio-kicker">Software engineer</p>
          <h1 id="studio-title">Hussain <span>Naqvi</span></h1>
          <p className="studio-role">I build full-stack products for the web.</p>
          <Link href="#projects" className="studio-intro-link" data-tactile data-magnetic data-material="paper">View projects <span aria-hidden>↓</span></Link>
        </div>

        <div className="studio-urdu-print" lang="ur" dir="rtl">
          <span>حسین نقوی</span>
          <small>سافٹ ویئر انجینئر</small>
        </div>

        <StudioProjectPins projects={projects} />

        <div className="studio-live-note" data-live={lastPush ? 'true' : 'false'}>
          <span className="studio-live-dot" aria-hidden />
          <span>
            {lastPush ? `Last pushed to ${lastPush.repo} · ${lastPush.when}` : 'Four documented projects'}
          </span>
          <a href="https://github.com/huchu19" data-tactile>GitHub ↗</a>
        </div>
      </div>
      <p className="studio-fallback-note">
        Select a pinned project or continue to the project list below.
      </p>
    </section>
  )
}
