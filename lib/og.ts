/**
 * Font loading for next/og (Satori needs TTF/OTF — the old-browser
 * User-Agent makes Google Fonts serve truetype). `text=` subsets the
 * font to exactly the glyphs each card needs.
 */
export async function loadGoogleFont(
  family: string,
  text: string,
  weight = 600,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0) Gecko/20100101 Firefox/4.0',
      },
    })
  ).text()
  // old-browser UA yields TTF/OTF/WOFF — all Satori-supported (never woff2)
  const match = css.match(/src: url\((.+?)\)/)
  if (!match) throw new Error(`could not load font: ${family}`)
  return await (await fetch(match[1])).arrayBuffer()
}

/* the shared paper palette for cards (raw hex — Satori has no CSS vars) */
export const OG = {
  paper: '#f4efe6',
  ink: '#201b14',
  inkSoft: '#5c5344',
  inkFaint: '#8d8271',
  line: '#d9cfbe',
  accent: '#bc4a18',
  accentDeep: '#8f3610',
  width: 1200,
  height: 630,
}
