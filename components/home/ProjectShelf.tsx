import Image from 'next/image'
import Link from 'next/link'
import CoverArt from '@/components/generative/CoverArt'
import type { Project } from '@/lib/projects'

/** Arrives already ordered, most recently worked on first. */
export default function ProjectShelf({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="project-shelf-section" aria-labelledby="work-title">
      <header className="shelf-heading">
        <div>
          <p className="section-hand">Selected projects</p>
          <h2 id="work-title">Projects</h2>
        </div>
        <p>
          Each project page documents what it does, how it is built, and its current status.
        </p>
      </header>

      <ol className="project-shelf">
        {projects.map((post, index) => (
          <li key={post.slug} className={`project-sheet project-sheet--${index + 1} paper-arrival`}>
            <Link href={post.permalink} data-tactile data-magnetic data-material="paper">
              <div className="project-sheet-image">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 90vw, 45vw"
                    // README images live on GitHub's hosts, outside next/image's allow-list
                    unoptimized={post.coverImage.startsWith('http')}
                  />
                ) : (
                  <CoverArt seed={post.slug} type={post.type} height={400} />
                )}
              </div>
              <div className="project-sheet-copy">
                <div className="project-sheet-meta">
                  <span>{post.status === 'in-progress' ? 'In progress' : post.status === 'archived' ? 'Archived' : 'Shipped'}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{post.title.split(':')[0]}</h3>
                <p>{post.excerpt}</p>
                {post.stack.length > 0 && <small>{post.stack.slice(0, 3).join(' · ')}</small>}
                <span className="project-sheet-open">Read the project README <span aria-hidden>→</span></span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
