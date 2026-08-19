import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Noto_Nastaliq_Urdu,
} from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Cursor from '@/components/ui/Cursor'
import CommandPalette from '@/components/ui/CommandPalette'
import EasterEggs from '@/components/ui/EasterEggs'
import ConstructionLines from '@/components/golden/ConstructionLines'
import { getFeed, toFeedItem } from '@/lib/posts'
import { getLastPush } from '@/lib/github'
import { site } from '@/lib/site'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
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
  document.documentElement.dataset.theme = theme === 'daylight' ? 'daylight' : 'default';
  document.documentElement.style.backgroundColor = theme === 'daylight' ? '#f5f0e8' : '#0b0e1f';
} catch (_) {
  document.documentElement.dataset.theme = 'default';
  document.documentElement.style.backgroundColor = '#0b0e1f';
}
`

const bodyThemeScript = `
try {
  const theme = document.documentElement.dataset.theme;
  document.body.style.backgroundColor = theme === 'daylight' ? '#f5f0e8' : '#0b0e1f';
  document.body.style.color = theme === 'daylight' ? '#2a231d' : '#f2ede3';
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const paletteItems = getFeed().map(toFeedItem)
  const status = await getLastPush()
  return (
    <html
      lang="en"
      data-theme="default"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} ${nastaliq.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: bodyThemeScript }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ConstructionLines />
        <div className="relative" style={{ zIndex: 2 }}>
          <Header status={status} />
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
