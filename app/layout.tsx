import type { Metadata } from 'next'
import { Fraunces, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InkReveal from '@/components/InkReveal'
import InkGhost from '@/components/InkGhost'
import Terminal, { type TermPost } from '@/components/Terminal'
import { getAllPosts, entryNumber, formatStamp } from '@/lib/posts'
import { site } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s · Field Notes',
  },
  description: site.description,
  alternates: {
    types: { 'application/rss+xml': `${site.url}/feed.xml` },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const termPosts: TermPost[] = getAllPosts().map((p) => ({
    n: entryNumber(p),
    slug: p.slug,
    permalink: p.permalink,
    type: p.type,
    date: formatStamp(p.date),
    title: p.title,
  }))

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${grotesk.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="fn-theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem('fn-theme')==='dusk')document.documentElement.dataset.theme='dusk'}catch(e){}`}
        </Script>
        <InkReveal />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <InkGhost />
        <Terminal posts={termPosts} />
      </body>
    </html>
  )
}
