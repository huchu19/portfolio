/**
 * OG-ONLY mirror of the daylight studio tokens in app/globals.css.
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
  bg: '#eee4d2',
  surface: '#f8f1e5',
  raised: '#e2d2bb',
  line: '#c8b79f',
  fg: '#302923',
  fgSoft: '#6f6257',
  fgFaint: '#8b7b6d',
  accent: '#c76345',
  accentDeep: '#8a3f31',
  signal: '#52745f',
  mustard: '#d6a43b',
  sage: '#789078',
  blue: '#6f8fa7',
  wood: '#8a5738',
} as const
