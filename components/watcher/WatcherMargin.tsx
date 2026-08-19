'use client'

import { useWatcher } from './WatcherProvider'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * A note in the margin of a desk — never a toast, never a modal.
 *
 * It is aria-hidden on purpose: the notes are decorative, and pushing
 * them into a live region would interrupt a screen reader mid-sentence.
 * The site has to be complete without them, so nothing here is the only
 * route to any information.
 *
 * The gutter is reserved whether or not a note is showing, so the page
 * never shifts when the desk decides to speak.
 */
export default function WatcherMargin() {
  const { note } = useWatcher()
  const reduced = usePrefersReducedMotion()

  return (
    <div aria-hidden="true" className="watcher-margin">
      <span
        className="watcher-note"
        data-visible={note ? 'true' : 'false'}
        style={reduced ? { transition: 'none' } : undefined}
      >
        {note}
      </span>
    </div>
  )
}
