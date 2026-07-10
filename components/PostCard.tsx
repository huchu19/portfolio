'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import {
  POST_TYPES,
  entryNumber,
  formatDate,
  formatStamp,
  type Post,
} from '@/lib/posts'

type Props = {
  post: Post
  /** first verse line, poetry entries only */
  verse?: string
}

function readingTime(post: Post): number {
  return Math.max(1, Math.ceil(post.metadata.readingTime))
}

function TitleLink({
  post,
  className,
  fvs,
}: {
  post: Post
  className: string
  fvs: string
}) {
  return (
    <h2 className={className} style={{ fontVariationSettings: fvs }}>
      <Link
        href={post.permalink}
        className="link-draw transition-colors duration-300 ease-soft group-hover:text-accent-deep"
      >
        {post.title}
      </Link>
    </h2>
  )
}

/* ------------------------------------------------------------------ */
/*  Five treatments — one stream, instantly tellable apart            */
/* ------------------------------------------------------------------ */

function EssayCard({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-x-8 py-10 md:grid-cols-[5.5rem_minmax(0,1fr)_9rem] md:py-12">
      <p className="entry-no mb-2 text-xl transition-all duration-500 ease-soft group-hover:-rotate-2 group-hover:text-accent-deep md:mb-0 md:pt-2">
        № {entryNumber(post)}
      </p>
      <div>
        <p className="meta-mono mb-3 text-ink-faint">
          {POST_TYPES.essay.glyph} Essay
        </p>
        <TitleLink
          post={post}
          className="max-w-[24ch] font-display text-3xl leading-[1.12] tracking-[-0.015em] md:text-[2.4rem]"
          fvs='"opsz" 96, "wght" 510, "SOFT" 25'
        />
        <p className="mt-4 max-w-[58ch] text-ink-soft">{post.excerpt}</p>
      </div>
      <div className="meta-mono mt-4 md:mt-0 md:pt-2 md:text-right">
        <p>{formatDate(post.date)}</p>
        <p className="mt-1 text-ink-faint">{readingTime(post)} min read</p>
      </div>
    </article>
  )
}

function ProjectCard({ post }: { post: Post }) {
  const links = post.projectLinks
  return (
    <article className="group relative grid gap-x-8 py-8 md:grid-cols-[5.5rem_minmax(0,1fr)_12rem]">
      <p className="entry-no mb-2 text-xl transition-all duration-500 ease-soft group-hover:-rotate-2 group-hover:text-accent-deep md:mb-0 md:pt-1">
        № {entryNumber(post)}
      </p>
      <div>
        <p className="meta-mono mb-2 text-ink-faint">
          {POST_TYPES.project.glyph} Project
        </p>
        <TitleLink
          post={post}
          className="font-display text-2xl leading-[1.15]"
          fvs='"opsz" 60, "wght" 540'
        />
        <p className="mt-2 max-w-[56ch] text-[0.95rem] text-ink-soft">
          {post.excerpt}
        </p>
        {post.tags.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="meta-mono border border-line px-2 py-0.5 text-[0.68rem]"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="meta-mono mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 md:mt-0 md:flex-col md:items-end md:pt-1 md:text-right">
        <p>{formatDate(post.date)}</p>
        <p className="text-ink-faint">{readingTime(post)} min</p>
        {(links?.live || links?.repo) && (
          <p className="flex gap-x-4 md:mt-2">
            {links?.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors duration-300 ease-soft hover:text-accent-deep hover:decoration-accent"
              >
                Live ↗
              </a>
            )}
            {links?.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors duration-300 ease-soft hover:text-accent-deep hover:decoration-accent"
              >
                Repo ↗
              </a>
            )}
          </p>
        )}
      </div>
    </article>
  )
}

function PoetryCard({ post, verse }: { post: Post; verse?: string }) {
  return (
    <article className="group relative flex flex-col items-center px-4 py-14 text-center md:py-16">
      <p className="entry-no text-lg transition-colors duration-500 ease-soft group-hover:text-accent-deep">№ {entryNumber(post)}</p>
      <TitleLink
        post={post}
        className="mt-4 max-w-[20ch] font-display text-3xl italic leading-[1.15] md:text-4xl"
        fvs='"opsz" 110, "wght" 430, "SOFT" 75'
      />
      {verse && (
        <p
          className="mt-4 font-display text-lg italic text-ink-soft"
          style={{ fontVariationSettings: '"opsz" 40, "SOFT" 50' }}
        >
          {verse}
        </p>
      )}
      <p className="meta-mono mt-6 text-ink-faint">
        <span aria-hidden="true" className="inline-block text-accent-deep transition-transform duration-500 ease-soft group-hover:scale-125">
          {POST_TYPES.poetry.glyph}
        </span>{' '}
        Poetry · {formatDate(post.date)}
      </p>
    </article>
  )
}

function JournalCard({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-x-8 py-8 md:grid-cols-[5.5rem_minmax(0,1fr)]">
      <p className="entry-no mb-2 text-xl transition-all duration-500 ease-soft group-hover:-rotate-2 group-hover:text-accent-deep md:mb-0 md:pt-9">
        № {entryNumber(post)}
      </p>
      <div className="relative bg-paper-deep px-6 py-8 md:px-9">
        <span
          aria-hidden="true"
          className="meta-mono absolute right-5 top-5 rotate-2 border border-ink-faint px-2 py-1 text-[0.68rem] transition-transform duration-500 ease-soft group-hover:rotate-0"
        >
          {formatStamp(post.date)}
        </span>
        <p className="meta-mono mb-2 text-ink-faint">
          {POST_TYPES.journal.glyph} Journal
        </p>
        <TitleLink
          post={post}
          className="max-w-[22ch] pr-20 font-display text-2xl leading-[1.15] md:pr-24"
          fvs='"opsz" 60, "wght" 500, "SOFT" 40'
        />
        <p className="mt-3 max-w-[54ch] text-[0.95rem] text-ink-soft">
          {post.excerpt}
        </p>
        <p className="sr-only">{formatDate(post.date)}</p>
      </div>
    </article>
  )
}

function AdventureCard({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-x-8 py-9 md:grid-cols-[5.5rem_minmax(0,1fr)_9rem]">
      <p className="entry-no mb-2 text-xl transition-all duration-500 ease-soft group-hover:-rotate-2 group-hover:text-accent-deep md:mb-0 md:pt-1">
        № {entryNumber(post)}
      </p>
      <div>
        <p className="meta-mono mb-3 text-ink-faint">
          {POST_TYPES.adventure.glyph} Adventure
        </p>
        {post.route && post.route.length > 0 && (
          <p className="meta-mono mb-4 flex flex-wrap items-center gap-2">
            {post.route.map((stop, i) => (
              <Fragment key={`${stop}-${i}`}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink-faint transition-colors duration-500 ease-soft group-hover:text-accent-deep">
                    →
                  </span>
                )}
                <span className="border border-line px-2 py-0.5">{stop}</span>
              </Fragment>
            ))}
          </p>
        )}
        <TitleLink
          post={post}
          className="max-w-[26ch] font-display text-2xl leading-[1.15] md:text-[1.7rem]"
          fvs='"opsz" 72, "wght" 510, "SOFT" 30'
        />
        <p className="mt-3 max-w-[56ch] text-ink-soft">{post.excerpt}</p>
      </div>
      <div className="meta-mono mt-4 md:mt-0 md:pt-1 md:text-right">
        <p>{formatDate(post.date)}</p>
        <p className="mt-1 text-ink-faint">{readingTime(post)} min read</p>
      </div>
    </article>
  )
}

export default function PostCard({ post, verse }: Props) {
  switch (post.type) {
    case 'essay':
      return <EssayCard post={post} />
    case 'project':
      return <ProjectCard post={post} />
    case 'poetry':
      return <PoetryCard post={post} verse={verse} />
    case 'journal':
      return <JournalCard post={post} />
    case 'adventure':
      return <AdventureCard post={post} />
  }
}
