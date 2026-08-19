/**
 * OG-ONLY mirror of the app/globals.css @theme block.
 *
 * satori (next/og ImageResponse) cannot resolve CSS custom properties,
 * so Open Graph images need literal values. These are the ONLY
 * sanctioned raw hex values outside globals.css (VISION Part 4's
 * no-raw-hex rule, honestly bent in one place instead of quietly
 * broken in many). Change both files or change neither.
 *
 * Import this from opengraph-image files and generated-asset routes
 * only — never from a component that renders into the page.
 */
export const ogPalette = {
  bg: '#0b0e1f',
  surface: '#131834',
  raised: '#1d2447',
  line: '#2e3763',
  fg: '#f2ede3',
  fgSoft: '#a8afc9',
  fgFaint: '#6f779a',
  accent: '#ffb020',
  accentDeep: '#c77e00',
  signal: '#2ee6c0',
} as const
