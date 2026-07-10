import type { ComponentProps } from 'react'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/posts'
import MDXContent from '@/components/MDXContent'
import LanternPoem from '@/components/LanternPoem'
import PoemStanza from '@/components/PoemStanza'
import styles from './PoetryLayout.module.css'

/** Stanzas reveal on scroll; MDX paragraphs become PoemStanza. */
const verseComponents = { p: PoemStanza } as unknown as ComponentProps<
  typeof MDXContent
>['components']

/**
 * Poetry — a poem read in generous ma. Narrow centered column, Fraunces
 * verse, no reading time, no tags; the date whispers at the end. The
 * lantern (cursor-proximity ink) lives in LanternPoem.
 */
export default function PoetryLayout({ post }: { post: Post }) {
  return (
    <article className="px-6 pb-40 pt-28 md:pb-56 md:pt-44">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className={styles.title}>{post.title}</h1>
      </header>

      <LanternPoem className="mt-24 md:mt-32">
        <div className={styles.verse}>
          <MDXContent
            code={post.code}
            components={{ p: PoemStanza } as never}
          />
        </div>
      </LanternPoem>

      <footer className="mt-28 text-center md:mt-36">
        <span aria-hidden="true" className="block text-lg text-accent">
          ❦
        </span>
        <time
          dateTime={post.date.slice(0, 10)}
          className="meta-mono mt-5 inline-block text-ink-faint"
        >
          {formatDate(post.date)}
        </time>
      </footer>
    </article>
  )
}
