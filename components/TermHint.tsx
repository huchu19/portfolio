'use client'

/** Footer doorway to the shell — for touch screens and the curious. */
export default function TermHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('fn:terminal'))}
      className="cursor-pointer transition-colors duration-300 ease-soft hover:text-ink"
      aria-label="Open the site terminal"
      title="Or just press ~"
    >
      ~ shell
    </button>
  )
}
