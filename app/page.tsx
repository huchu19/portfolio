import StudioHero from '@/components/home/studio/StudioHero'
import ProjectShelf from '@/components/home/ProjectShelf'
import ScrollProgress from '@/components/ui/ScrollProgress'
import GardenFireflies from '@/components/home/GardenFireflies'
import ContactGarden from '@/components/home/ContactGarden'
import { GardenThreshold, SkyAscent } from '@/components/home/GardenJourney'
import { getProjects } from '@/lib/projects'
import { getShipping } from '@/lib/github'
import { site } from '@/lib/site'

export default async function HomePage() {
  const projects = await getProjects()
  const shipping = await getShipping()

  return (
    <div className="descent">
      <ScrollProgress />

      <StudioHero
        posts={projects.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          permalink: post.permalink,
          type: post.type,
          status: post.status,
          stack: post.stack,
          coverImage: post.coverImage,
        }))}
        shipping={shipping}
      />

      <GardenThreshold />

      <div className="garden-world">
        <div className="garden-stars" aria-hidden />
        <GardenFireflies />
        <div className="garden-canopy" aria-hidden>
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="garden-edge-blend" aria-hidden />
        <ProjectShelf projects={projects} />
      </div>

      <SkyAscent />

      <div className="sky-world">
        <div className="sky-world-stars" aria-hidden />
        <ContactGarden email={site.email} />
      </div>
    </div>
  )
}
