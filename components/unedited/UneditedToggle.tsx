'use client'

import { useUnedited } from './UneditedProvider'

/**
 * Marigold, not teal — this is the site talking about itself, not
 * reporting live data.
 */
export default function UneditedToggle() {
  const { unedited, toggle } = useUnedited()
  return (
    <button
      type="button"
      data-magnetic
      data-feedback="strong"
      onClick={toggle}
      aria-pressed={unedited}
      title={
        unedited
          ? 'Show the published text'
          : 'Show the draft underneath — cuts and doubts included'
      }
      className="mono-label cursor-pointer rounded border px-2 py-1 transition-colors"
      style={{
        borderColor: unedited ? 'var(--color-accent-deep)' : 'var(--color-line)',
        color: unedited ? 'var(--color-accent)' : undefined,
        fontSize: 10.5,
      }}
    >
      {unedited ? 'unedited' : 'edited'}
    </button>
  )
}
