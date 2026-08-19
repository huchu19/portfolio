import { INV_PHI } from '@/lib/golden'
import { phyllotaxis, seededRng, type Rng } from '@/lib/generative'
import { ogPalette as c } from '@/lib/palette'

/**
 * The wallpaper, generated: ridgelines under a seeded phyllotaxis moon
 * on the void. Stands in for the real mountains photograph (BUILDLOG
 * "remains" list) — deterministic, served static, swappable later.
 * Standalone SVG can't reach the page's CSS tokens, so colors come
 * from the sanctioned lib/palette.ts mirror.
 */

export const dynamic = 'force-static'

const W = 1300
const H = 800

function ridge(rng: Rng, baseY: number, amp: number): string {
  const f1 = 1.5 + rng() * 2
  const f2 = 3 + rng() * 3
  const p1 = rng() * Math.PI * 2
  const p2 = rng() * Math.PI * 2
  const pts: string[] = []
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * W
    const t = i / 60
    const y =
      baseY -
      amp * (0.65 * Math.sin(t * f1 * Math.PI + p1) + 0.35 * Math.sin(t * f2 * Math.PI + p2))
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return `M 0 ${H} L ${pts.join(' L ')} L ${W} ${H} Z`
}

function buildWallpaper(): string {
  const rng = seededRng('nastaliq-over-mountains')
  const parts: string[] = []

  parts.push(`<rect width="${W}" height="${H}" fill="${c.bg}"/>`)

  // sparse stars
  for (let i = 0; i < 70; i++) {
    const x = rng() * W
    const y = rng() * H * 0.55
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + rng() * 1.1).toFixed(2)}" fill="${c.fgSoft}" opacity="${(0.15 + rng() * 0.3).toFixed(2)}"/>`,
    )
  }

  // the ember moon — a phyllotaxis bloom at the golden point
  const moonX = W * INV_PHI
  const moonY = H * (1 - INV_PHI) * 0.72
  const moonBands = [c.accentDeep, c.accent, c.accent]
  for (const d of phyllotaxis(seededRng('the-moon'), 144)) {
    parts.push(
      `<circle cx="${(moonX + d.x * 110).toFixed(1)}" cy="${(moonY + d.y * 110).toFixed(1)}" r="${(d.r * 110).toFixed(2)}" fill="${moonBands[d.band]}" opacity="${d.band === 2 ? 0.9 : 0.55}"/>`,
    )
  }

  // ridgelines, far to near
  const layers: [number, number, string, number][] = [
    [H * 0.62, 90, c.surface, 0.75],
    [H * 0.72, 110, c.surface, 1],
    [H * 0.84, 130, c.line, 0.45],
    [H * 0.95, 150, c.line, 0.7],
  ]
  for (const [baseY, amp, fill, opacity] of layers) {
    parts.push(`<path d="${ridge(rng, baseY, amp)}" fill="${fill}" opacity="${opacity}"/>`)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`
}

export function GET() {
  return new Response(buildWallpaper(), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
