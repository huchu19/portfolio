/**
 * Deterministic placement for the desk scene's floating wall objects.
 *
 * Seeded by each post's slug (never index or date), so adding or removing a
 * post never reshuffles anyone else's spot release to release. Built on the
 * same seeded-RNG and fibonacci primitives as the rest of the site's
 * generative art (lib/generative.ts, lib/golden.ts) — no new randomness
 * system. Positions are returned as percentages of the wall zone, not
 * pixels, so the same data works at any container size.
 */

import type { Post } from './posts'
import { seededRng } from './generative'
import { fib } from './golden'

export type WallLayoutItem = {
  post: Post
  xPct: number
  yPct: number
  rotationDeg: number
  scale: number
}

type Cell = { col: number; row: number }
type Bound = { start: number; end: number }

/**
 * The wall band occupies the upper portion of the scene; the desk and its
 * standing figure own the rest, so objects never compete with the figure
 * for the same ground.
 */
const WALL_ZONE_HEIGHT_PCT = 58

/** Fibonacci-weighted cell edges (largest first), summing to 100%. */
function cellBounds(count: number): Bound[] {
  const weights = Array.from({ length: count }, (_, i) => fib(Math.max(6 - i, 1)))
  const total = weights.reduce((a, b) => a + b, 0)
  let acc = 0
  return weights.map((w) => {
    const start = (acc / total) * 100
    acc += w
    return { start, end: (acc / total) * 100 }
  })
}

/**
 * Grid dimensions grow with the post count, always leaving at least one
 * spare cell so placement never has to wrap or collide.
 */
function gridSize(count: number): { cols: number; rows: number } {
  const rows = Math.ceil(Math.sqrt(count + 1))
  const cols = Math.ceil((count + 1) / rows)
  return { cols, rows }
}

export function computeWallLayout(posts: Post[]): WallLayoutItem[] {
  const { cols, rows } = gridSize(posts.length)
  const colBounds = cellBounds(cols)
  const rowBounds = cellBounds(rows)

  const openCells: Cell[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) openCells.push({ col, row })
  }

  return posts.map((post) => {
    const rng = seededRng(post.slug)
    const cellIdx = Math.floor(rng() * openCells.length)
    const [cell] = openCells.splice(cellIdx, 1)

    const x = colBounds[cell.col]
    const y = rowBounds[cell.row]

    // Inset by ~28% of the cell on each side, so the object's own footprint
    // never crosses into a neighboring cell — zero overlap by construction.
    const insetX = (x.end - x.start) * 0.28
    const insetY = (y.end - y.start) * 0.28

    const yRaw = y.start + insetY + rng() * (y.end - y.start - insetY * 2)

    return {
      post,
      xPct: x.start + insetX + rng() * (x.end - x.start - insetX * 2),
      yPct: (yRaw / 100) * WALL_ZONE_HEIGHT_PCT,
      rotationDeg: (rng() - 0.5) * 12,
      scale: 0.9 + rng() * 0.2,
    }
  })
}
