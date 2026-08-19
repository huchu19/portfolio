'use client'

import { useWatcher } from './WatcherProvider'

/**
 * The footer email. Hovering it without clicking is the one signal that
 * unlocks the Watcher's last line, so the link owns that gesture.
 */
export default function EmailLink({ email }: { email: string }) {
  const { markEmailHover } = useWatcher()
  return (
    <a
      href={`mailto:${email}`}
      className="transition-colors hover:text-(--color-fg)"
      onMouseEnter={markEmailHover}
      onFocus={markEmailHover}
    >
      Email
    </a>
  )
}
