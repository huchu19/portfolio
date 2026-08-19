'use client'

import MDXContent from '@/components/MDXContent'
import { useUnedited } from './UneditedProvider'

/**
 * Renders the published body, or the draft underneath when the switch is
 * on. Both bodies are compiled at build time and shipped together, so
 * flipping the switch costs no request.
 *
 * A post with no surviving draft says so plainly rather than pretending
 * the published text is one.
 */
export default function PostBody({
  code,
  uneditedCode,
  className,
}: {
  code: string
  uneditedCode?: string
  className?: string
}) {
  const { unedited, ready } = useUnedited()
  const showDraft = ready && unedited

  return (
    <div className={className}>
      {showDraft && !uneditedCode && (
        <p className="draft-note" style={{ marginBottom: 'calc(var(--u) * 4)' }}>
          no draft survives for this one
        </p>
      )}
      <MDXContent code={showDraft && uneditedCode ? uneditedCode : code} />
    </div>
  )
}
