'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { emitFeedback } from '@/lib/feedback'

function transitionFor(href: string) {
  if (href.startsWith('/projects/')) return 'notebook'
  if (href.startsWith('/blog/')) return 'notebook'
  if (href === '/blog') return 'drawer'
  if (href.startsWith('/fragments/')) return 'scrap'
  if (href.startsWith('/archive') || href.startsWith('/now')) return 'drawer'
  if (href.startsWith('/about') || href.startsWith('/colophon')) return 'letter'
  return 'room'
}

export default function PageTransitions() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.dataset.pageReady = 'true'
    delete document.documentElement.dataset.pageLeaving
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download') || link.dataset.noTransition === 'true') return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin) {
        if (link.dataset.externalPaper !== undefined && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          event.preventDefault()
          link.dataset.leaving = 'true'
          emitFeedback('open')
          window.setTimeout(() => window.location.assign(url.href), 180)
        }
        return
      }
      if (url.pathname === window.location.pathname && url.search === window.location.search || link.getAttribute('href')?.startsWith('#')) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      event.preventDefault()
      document.documentElement.dataset.pageLeaving = transitionFor(url.pathname)
      window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), 210)
    }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [pathname, router])

  return <div className="route-transition-curtain" aria-hidden />
}
