// One-off DOM diagnostics for the home grid + spiral
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: 'shell' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3500))

const info = await page.evaluate(() => {
  const q = (s) => document.querySelector(s)
  const rect = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  const spiral = q('.spiral-path')
  const cs = spiral ? getComputedStyle(spiral) : null
  const grid = q('.home-grid')
  const feed = q('.cell-feed')
  const feedScroller = feed?.querySelector('.overflow-y-auto')
  const overlay = q('.spiral-overlay')
  const construction = document.querySelectorAll('svg.pointer-events-none.fixed')
  return {
    spiralComputed: cs
      ? {
          dasharray: cs.strokeDasharray,
          dashoffset: cs.strokeDashoffset,
          animationName: cs.animationName,
          opacity: cs.opacity,
          totalLength: spiral.getTotalLength?.(),
        }
      : null,
    gridRect: rect(grid),
    feedRect: rect(feed),
    feedScrollerRect: rect(feedScroller),
    feedScrollHeight: feedScroller?.scrollHeight,
    overlayRect: rect(overlay),
    constructionCount: construction.length,
    constructionOpacity: construction[0] ? getComputedStyle(construction[0]).opacity : null,
    constructionRect: rect(construction[0]),
    docHeight: document.documentElement.scrollHeight,
    ghazalRect: rect(q('.urdu')),
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
