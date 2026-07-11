import type { Metadata } from 'next'
import {
  Instrument_Serif,
  Inter,
  Geist_Mono,
  Noto_Nastaliq_Urdu,
} from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Cursor from '@/components/ui/Cursor'
import CommandPalette from '@/components/ui/CommandPalette'
import ConstructionLines from '@/components/golden/ConstructionLines'
import { getFeed, toFeedItem } from '@/lib/posts'
import { site } from '@/lib/site'
import './globals.css'

const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

// Loaded lazily (no preload) — the browser only fetches it when Urdu text
// actually renders on the page. Nastaliq is structural, not decorative.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-noto-nastaliq',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
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
  const paletteItems = getFeed().map(toFeedItem)
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${inter.variable} ${geistMono.variable} ${nastaliq.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ConstructionLines />
        <div className="relative" style={{ zIndex: 2 }}>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <CommandPalette items={paletteItems} />
        <Cursor />
      </body>
    </html>
  )
}
