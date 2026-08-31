import type { Metadata, Viewport } from 'next'
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Noto_Nastaliq_Urdu,
} from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import CommandPalette from '@/components/ui/CommandPalette'
import InteractionLayer from '@/components/ui/InteractionLayer'
import PageTransitions from '@/components/ui/PageTransitions'
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
  document.documentElement.dataset.theme = theme === 'night' ? 'night' : 'daylight';
  document.documentElement.style.backgroundColor = theme === 'night' ? '#28231f' : '#eee4d2';
} catch (_) {
  document.documentElement.dataset.theme = 'daylight';
  document.documentElement.style.backgroundColor = '#eee4d2';
}
`

const bodyThemeScript = `
try {
  const theme = document.documentElement.dataset.theme;
  document.body.style.backgroundColor = theme === 'night' ? '#28231f' : '#eee4d2';
  document.body.style.color = theme === 'night' ? '#f1e8da' : '#302923';
} catch (_) {}
`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '192x192', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#1e5b43',
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
      data-theme="daylight"
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
        <div className="relative" style={{ zIndex: 2 }}>
          <Header status={status} />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <CommandPalette items={paletteItems} />
        <InteractionLayer />
        <PageTransitions />
      </body>
    </html>
  )
}
