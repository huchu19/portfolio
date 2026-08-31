// Screenshot critique harness (FABLE 25 pattern).
// usage: node tools/shot.mjs <url> <out.png> [WxH=1440x900] [scrollY=0] [waitMs=2500] [--reduced] [--night]
//   --reduced  emulate prefers-reduced-motion: reduce
//   --night    load with the night-studio localStorage preference
// prints: {"out":"...","docHeight":N,"errors":[...]}
import puppeteer from 'puppeteer'

const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const [url, out, size = '1440x900', scrollY = '0', waitMs = '2500'] = args
if (!url || !out) {
  console.error('usage: node tools/shot.mjs <url> <out.png> [WxH] [scrollY] [waitMs] [--reduced] [--night]')
  process.exit(1)
}
const [width, height] = size.split('x').map(Number)

const browser = await puppeteer.launch({
  headless: 'shell',
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
})
const page = await browser.newPage()
await page.setViewport({ width, height, deviceScaleFactor: 2 })
if (flags.includes('--reduced')) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
}
if (flags.includes('--night')) {
  await page.evaluateOnNewDocument(() => localStorage.setItem('theme', 'night'))
}
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY))
}
await new Promise((r) => setTimeout(r, Number(waitMs)))
const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
await page.screenshot({ path: out })
await browser.close()
console.log(JSON.stringify({ out, docHeight, errors }))
