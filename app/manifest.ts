import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#eee4d2',
    theme_color: '#1e5b43',
    icons: [
      {
        src: '/icons/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
