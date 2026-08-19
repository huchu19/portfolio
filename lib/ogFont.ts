import { readFile } from 'fs/promises'
import path from 'path'

/** Bricolage Grotesque for satori — OG cards render at build time (node). */
export function ogFont() {
  return readFile(
    path.join(process.cwd(), 'assets/fonts/BricolageGrotesque-Regular.ttf'),
  )
}
