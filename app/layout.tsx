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
import EasterEggs from '@/components/ui/EasterEggs'
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

const themeScript = `
try {
  const theme = localStorage.getItem('theme');
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.style.backgroundColor = theme === 'light' ? '#f5f0e8' : '#0c0a08';
} catch (_) {
  document.documentElement.dataset.theme = 'dark';
  document.documentElement.style.backgroundColor = '#0c0a08';
}
`

const bodyThemeScript = `
try {
  const theme = document.documentElement.dataset.theme;
  document.body.style.backgroundColor = theme === 'light' ? '#f5f0e8' : '#0c0a08';
  document.body.style.color = theme === 'light' ? '#2a231d' : '#e8dfd0';
} catch (_) {}
`

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
      data-theme="dark"
      suppressHydrationWarning
      className={`${instrument.variable} ${inter.variable} ${geistMono.variable} ${nastaliq.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bodyThemeScript }} />
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
        <EasterEggs />
      </body>
    </html>
  )
}
