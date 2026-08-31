import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/posts'

const ORDER = ['jobhunter', 'edunexus', 'bamboo', 'tifltoys']

export default function ProjectShelf({ posts }: { posts: Post[] }) {
  const projects = posts
    .filter((post) => post.type === 'project')
    .sort((a, b) => ORDER.findIndex((name) => a.slug.includes(name)) - ORDER.findIndex((name) => b.slug.includes(name)))

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
              {post.coverImage && (
                <div className="project-sheet-image">
                  <Image src={post.coverImage} alt="" fill sizes="(max-width: 760px) 90vw, 45vw" />
                </div>
              )}
              <div className="project-sheet-copy">
                <div className="project-sheet-meta">
                  <span>{post.status === 'in-progress' ? 'In progress' : 'Shipped'}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{post.title.split(':')[0]}</h3>
                <p>{post.excerpt}</p>
                {post.stack && <small>{post.stack.slice(0, 3).join(' · ')}</small>}
                <span className="project-sheet-open">Read the project README <span aria-hidden>→</span></span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
