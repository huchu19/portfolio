// Screenshot critique harness (FABLE 25 pattern).
// usage: node tools/shot.js <url> <out.png> [WxH=1440x900] [scrollY=0] [waitMs=2500]
// prints: {"out":"...","docHeight":N,"errors":[...]}
import puppeteer from 'puppeteer'

const [url, out, size = '1440x900', scrollY = '0', waitMs = '2500'] = process.argv.slice(2)
if (!url || !out) {
  console.error('usage: node tools/shot.js <url> <out.png> [WxH] [scrollY] [waitMs]')
  process.exit(1)
}
const [width, height] = size.split('x').map(Number)

const browser = await puppeteer.launch({ headless: 'shell' })
const page = await browser.newPage()
await page.setViewport({ width, height, deviceScaleFactor: 2 })
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
