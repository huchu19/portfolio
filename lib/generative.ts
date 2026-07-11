/**
 * Seeded generative systems — the garden's growth logic.
 *
 * Everything here is deterministic and isomorphic: the same seed string
 * produces the same output at build time, in a server component, and
 * after hydration. No Math.random, no DOM. Generators return geometry
 * plus a color *band index* — never a color — so DOM consumers map
 * bands to CSS tokens (var(--color-…)) and stay theme-correct.
 */

import { PHI, goldenSplit } from './golden'

export type Rng = () => number

/** xmur3 string hash — turns a slug into a well-mixed 32-bit seed. */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

/** mulberry32 — tiny seeded PRNG, uniform in [0, 1). */
function mulberry32(seed: number): Rng {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededRng(seed: string): Rng {
  return mulberry32(xmur3(seed)())
}

/** The golden angle: 360 / φ² ≈ 137.508°. Derived, not hardcoded. */
export const GOLDEN_ANGLE = 360 / (PHI * PHI)

/**
 * Color bands. Weighted so band 2 (the consumer's accent — ember)
 * stays under the ≤10% ember budget from VISION Part 4.
 */
export function pickBand(rng: Rng): number {
  const v = rng()
  return v < 0.7 ? 0 : v < 0.92 ? 1 : 2
}

export type Dot = { x: number; y: number; r: number; band: number }

/**
 * Golden-angle phyllotaxis — the sunflower-head placement. Points fill
 * a unit disc centered on (0,0): point k sits at angle k·137.508° and
 * radius √(k/n), so density is even from core to rim.
 */
export function phyllotaxis(rng: Rng, n: number): Dot[] {
  const dots: Dot[] = []
  const phase = rng() * 360
  for (let k = 1; k <= n; k++) {
    const a = ((k * GOLDEN_ANGLE + phase) * Math.PI) / 180
    const radius = Math.sqrt(k / n)
    dots.push({
      x: radius * Math.cos(a),
      y: radius * Math.sin(a),
      // seeds grow toward the rim, with a whisper of jitter
      r: 0.008 + 0.022 * radius + rng() * 0.006,
      band: pickBand(rng),
    })
  }
  return dots
}

export type Stroke = { points: { x: number; y: number }[]; band: number }

/**
 * Flow-field strokes in the unit square. The field is a smooth sum of
 * seeded sinusoids (cheap, deterministic value-noise stand-in); each
 * stroke drops in at a random point and drifts along the field.
 */
export function flowStrokes(rng: Rng, count: number, steps = 42): Stroke[] {
  const a0 = rng() * Math.PI * 2
  const f1 = 1 + rng() * 2
  const f2 = 1 + rng() * 2
  const p1 = rng()
  const p2 = rng()
  const angle = (x: number, y: number) =>
    a0 +
    1.4 * Math.sin(2 * Math.PI * (x * f1 + p1)) +
    1.4 * Math.cos(2 * Math.PI * (y * f2 + p2))

  const strokes: Stroke[] = []
  const step = 0.012
  for (let i = 0; i < count; i++) {
    let x = rng()
    let y = rng()
    const points = [{ x, y }]
    for (let s = 0; s < steps; s++) {
      const a = angle(x, y)
      x += Math.cos(a) * step
      y += Math.sin(a) * step
      if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) break
      points.push({ x, y })
    }
    if (points.length > 3) strokes.push({ points, band: pickBand(rng) })
  }
  return strokes
}

export type Leaf = { x: number; y: number; angle: number; size: number; t: number }
export type Stem = {
  /** SVG path in the unit square; y=1 is the ground line. */
  d: string
  leaves: Leaf[]
  band: number
  /** tip of the stalk, for blooms */
  tip: { x: number; y: number }
}

/**
 * Garden stalks — quadratic-bezier stems rooted on y=1, leaves placed
 * at golden-split fractions of the stalk's length, alternating sides.
 */
export function stems(rng: Rng, count: number): Stem[] {
  const out: Stem[] = []
  const [major] = goldenSplit(1)
  for (let i = 0; i < count; i++) {
    const rootX = 0.1 + 0.8 * ((i + rng() * 0.6) / count)
    const height = 0.35 + rng() * 0.5
    const sway = (rng() - 0.5) * 0.3
    const p0 = { x: rootX, y: 1 }
    const p1 = { x: rootX + sway * 0.35, y: 1 - height * 0.55 }
    const p2 = { x: rootX + sway, y: 1 - height }

    const at = (t: number) => {
      const u = 1 - t
      return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
      }
    }
    const tangentAngle = (t: number) => {
      const u = 1 - t
      const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
      const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
      return (Math.atan2(dy, dx) * 180) / Math.PI
    }

    // leaves at the golden cascade: 0.382, 0.618, 0.854…
    const ts = [1 - major, major, major + (1 - major) * major]
    const leaves: Leaf[] = ts
      .filter(() => rng() > 0.25)
      .map((t, j) => {
        const p = at(t)
        const side = j % 2 === 0 ? 1 : -1
        return {
          x: p.x,
          y: p.y,
          angle: tangentAngle(t) + side * 55,
          size: 0.028 + rng() * 0.02,
          t,
        }
      })

    out.push({
      d: `M ${p0.x.toFixed(4)} ${p0.y.toFixed(4)} Q ${p1.x.toFixed(4)} ${p1.y.toFixed(4)} ${p2.x.toFixed(4)} ${p2.y.toFixed(4)}`,
      leaves,
      band: pickBand(rng),
      tip: at(1),
    })
  }
  return out
}
