'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

/**
 * Select a passage and a little stamp offers to quote it — copied with
 * quotation marks, attribution, and the link, ready to paste anywhere.
 */
export default function QuoteStamp({ title }: { title: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const textRef = useRef('')

  useEffect(() => {
    const show = () => {
      const sel = document.getSelection()
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return setPos(null)
      const text = sel.toString().replace(/\s+/g, ' ').trim()
      if (text.length < 12 || text.length > 600) return setPos(null)
      const anchor =
        sel.anchorNode instanceof Element
          ? sel.anchorNode
          : sel.anchorNode?.parentElement
      if (!anchor?.closest('article')) return setPos(null)
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      textRef.current = text
      setCopied(false)
      setPos({
        x: Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90),
        y: Math.max(rect.top, 64),
      })
    }
    const onUp = () => setTimeout(show, 0)
    const onChange = () => {
      const sel = document.getSelection()
      if (!sel || sel.isCollapsed) setPos(null)
    }
    const onHide = () => setPos(null)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('selectionchange', onChange)
    window.addEventListener('scroll', onHide, { passive: true })
    return () => {
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('selectionchange', onChange)
      window.removeEventListener('scroll', onHide)
    }
  }, [])

  if (!pos) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `“${textRef.current}”\n\n— ${site.name}, ${title}\n${window.location.href}`,
      )
      setCopied(true)
      setTimeout(() => setPos(null), 900)
    } catch {
      setPos(null)
    }
  }

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={copy}
      className="meta-mono fixed z-[80] -translate-x-1/2 -translate-y-[130%] cursor-pointer border-2 border-accent bg-paper px-3 py-1.5 text-accent-deep shadow-[0_10px_28px_-14px_rgb(32_27_20/0.5)] transition-colors duration-300 ease-soft hover:bg-accent hover:text-paper"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -130%) rotate(-2deg)',
        animation: 'page-enter 0.25s var(--ease) both',
      }}
    >
      {copied ? '✓ copied' : '❝ quote this'}
    </button>
  )
}
