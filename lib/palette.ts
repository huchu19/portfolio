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
  void: '#0c0a08',
  voidRaised: '#161210',
  voidLine: '#2a2420',
  ash: '#8c7e6e',
  bone: '#e8dfd0',
  white: '#f5f0e8',
  ember: '#e07a2f',
  emberBright: '#f09940',
  emberDeep: '#b85a1a',
  wave: '#3a6b8c',
  moss: '#6b8c5a',
} as const
