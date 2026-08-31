import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing and poetry by Hussain Naqvi.',
}

export default function BlogPage() {
  return (
    <div className="blog-index mx-auto w-full">
      <header className="blog-index-header">
        <p className="mono-label">Writing · poetry · notes</p>
        <h1 className="display">Blog</h1>
        <p>A small place for finished writing. No filler.</p>
      </header>

      <section className="blog-list" aria-label="Blog posts">
        <article className="blog-card blog-card--ghazal">
          <Link href="/blog/khwabon-ka-bagh" data-tactile data-magnetic>
            <div className="blog-garden-art" aria-hidden>
              <i className="blog-art-seed" />
              <i className="blog-art-stem" />
              <span className="blog-art-flower"><i /><i /><i /><i /><b /></span>
              <span className="blog-art-ember"><i /><i /><i /></span>
              <i className="blog-art-shoot" />
            </div>
            <div className="blog-card-copy">
              <div className="blog-card-meta mono-label">
                <span>Ghazal</span>
                <span>Urdu · English</span>
              </div>
              <p className="urdu" lang="ur" dir="rtl">خوابوں کا باغ</p>
              <h2 className="display">Khwabon Ka Bagh</h2>
              <p>Seeds ask for darkness; gardens bloom, tire, burn, and begin again.</p>
              <span className="blog-card-open mono-label">Read the ghazal →</span>
            </div>
          </Link>
        </article>
      </section>
    </div>
  )
}
