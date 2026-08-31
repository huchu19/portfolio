'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { emitFeedback } from '@/lib/feedback'
import type { StudioPost } from './types'

const SECRET_ORDER = [0, 2, 1, 3]

function shortProjectName(post: StudioPost) {
  return post.title.split(':')[0]
}

export default function StudioProjectPins({ projects }: { projects: StudioPost[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const sequence = useRef<number[]>([])

  useEffect(() => {
    if (open === null) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const pressPin = (index: number) => {
    emitFeedback('press')
    const next = [...sequence.current, index].slice(-SECRET_ORDER.length)
    sequence.current = next
    if (next.length === SECRET_ORDER.length && next.every((value, position) => value === SECRET_ORDER[position])) {
      sequence.current = []
      emitFeedback('discover')
      window.dispatchEvent(new CustomEvent('egg:pin-poem'))
    }
  }

  return (
    <>
      <nav className="studio-project-pins" aria-label="Featured work in the studio">
        {projects.map((post, index) => (
          <div
            key={post.slug}
            className={`studio-project-pin studio-project-pin--${index + 1}`}
            data-open={open === index ? 'true' : 'false'}
          >
            <button
              type="button"
              className="studio-pin-mark"
              data-feedback="off"
              aria-label={`Press the pin holding ${shortProjectName(post)}`}
              onClick={() => pressPin(index)}
            />
            <Link
              href={post.permalink}
              data-tactile
              data-magnetic
              onClick={(event) => {
                if (open !== index) {
                  event.preventDefault()
                  emitFeedback('open')
                  setOpen(index)
                }
              }}
            >
              <small>{post.status === 'in-progress' ? 'In progress' : 'Project'}</small>
              <strong>{shortProjectName(post)}</strong>
              <span>{post.excerpt}</span>
              <em>{open === index ? 'Click again to open ↗' : 'Lift for a preview'}</em>
            </Link>
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="project-preview-scrim"
        aria-label="Close project preview"
        aria-hidden={open === null}
        tabIndex={open === null ? -1 : 0}
        data-open={open !== null ? 'true' : 'false'}
        onClick={() => setOpen(null)}
      />
    </>
  )
}
