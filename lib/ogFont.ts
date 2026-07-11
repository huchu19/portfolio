import { readFile } from 'fs/promises'
import path from 'path'

/** Instrument Serif for satori — OG cards render at build time (node). */
export function ogFont() {
  return readFile(path.join(process.cwd(), 'assets/fonts/InstrumentSerif-Regular.ttf'))
}
