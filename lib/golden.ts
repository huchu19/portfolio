/**
 * Golden ratio math — the structural DNA of the site (VISION.md Part 9).
 * Everything the grid and the spiral draw is derived here, not eyeballed.
 */

export const PHI = (1 + Math.sqrt(5)) / 2 // 1.6180339887…
export const INV_PHI = 1 / PHI // 0.6180339887…

export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] as const

export function fib(n: number): number {
  let a = 1
  let b = 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
  return n < 2 ? 1 : b
}

export type Rect = { x: number; y: number; w: number; h: number }

/**
 * Subdivide a golden rectangle into its spiral of squares.
 * Squares are cut in the classic rotation: left → top → right → bottom.
 * Returns the squares (for construction lines) and the quarter-circle
 * arcs (as SVG path segments) that join into the golden spiral.
 */
export function goldenSubdivision(
  width: number,
  height: number = width * INV_PHI,
  steps = 8,
): { squares: Rect[]; spiralPath: string } {
  const squares: Rect[] = []
  let { x, y, w, h } = { x: 0, y: 0, w: width, h: height }
  const segs: string[] = []

  for (let i = 0; i < steps; i++) {
    const dir = i % 4
    if (dir === 0) {
      // square on the left; arc bulges toward its top-left corner
      const s = h
      squares.push({ x, y, w: s, h: s })
      segs.push(
        i === 0 ? `M ${x} ${y + s}` : '',
        `A ${s} ${s} 0 0 1 ${x + s} ${y}`,
      )
      x += s
      w -= s
    } else if (dir === 1) {
      // square on the top; arc bulges toward its top-right corner
      const s = w
      squares.push({ x, y, w: s, h: s })
      segs.push(`A ${s} ${s} 0 0 1 ${x + s} ${y + s}`)
      y += s
      h -= s
    } else if (dir === 2) {
      // square on the right; arc bulges toward its bottom-right corner
      const s = h
      squares.push({ x: x + w - s, y, w: s, h: s })
      segs.push(`A ${s} ${s} 0 0 1 ${x + w - s} ${y + s}`)
      w -= s
    } else {
      // square on the bottom; arc bulges toward its bottom-left corner
      const s = w
      squares.push({ x, y: y + h - s, w: s, h: s })
      segs.push(`A ${s} ${s} 0 0 1 ${x} ${y + h - s}`)
      h -= s
    }
  }

  return { squares, spiralPath: segs.filter(Boolean).join(' ') }
}

/**
 * Fibonacci fractions for CSS grid templates:
 * fibFractions(3) → "8fr 5fr 3fr" (largest first).
 */
export function fibFractions(count: number, largest = 6): string {
  const parts: string[] = []
  for (let i = 0; i < count; i++) parts.push(`${fib(Math.max(largest - i, 1))}fr`)
  return parts.join(' ')
}

/** 61.8% / 38.2% — the golden split of any length. */
export function goldenSplit(total: number): [number, number] {
  const major = total * INV_PHI
  return [major, total - major]
}
