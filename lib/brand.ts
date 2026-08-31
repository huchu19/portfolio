import { readFile } from 'node:fs/promises'
import path from 'node:path'

let signatureDataUrl: Promise<string> | undefined

/** Inline the mark for next/og, which requires an absolute URL or data URL. */
export function getSignatureDataUrl() {
  signatureDataUrl ??= readFile(
    path.join(process.cwd(), 'public/brand/hussain-signature-light.svg'),
    'utf8',
  ).then((svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)

  return signatureDataUrl
}
