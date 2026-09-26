// Project covers: screenshot each project's live site after its repo changes.
// usage: node tools/covers.mjs   (GITHUB_TOKEN optional; the workflow passes one)
// Writes public/media/projects/<slug>.jpg and records the push it was taken
// at in content/project-covers.json, so repos that haven't moved are skipped.
// Runs daily from .github/workflows/project-covers.yml.
import { readFile, unlink, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

// Keep in step with lib/projects.ts.
const USER = 'huchu19'
const EXCLUDE = new Set(['huchu19', 'portfolio'])
const HIDE_TOPIC = 'hide-from-portfolio'
const MANIFEST = 'content/project-covers.json'

const headers = { Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&per_page=100`, { headers })
if (!res.ok) throw new Error(`GitHub answered ${res.status}`)
const repos = (await res.json()).filter(
  (r) =>
    !r.fork &&
    r.size > 0 &&
    r.homepage &&
    !EXCLUDE.has(r.name.toLowerCase()) &&
    !r.topics?.includes(HIDE_TOPIC),
)

const covers = JSON.parse(await readFile(MANIFEST, 'utf8'))
const stale = repos.filter((r) => covers[r.name.toLowerCase()]?.pushedAt !== r.pushed_at)
if (stale.length === 0) {
  console.log('Covers are current.')
  process.exit(0)
}

const browser = await puppeteer.launch({
  headless: 'shell',
  // GitHub's Ubuntu runners block Chrome's sandbox.
  args: process.env.CI ? ['--no-sandbox'] : [],
})

for (const r of stale) {
  const slug = r.name.toLowerCase()
  const url = /^https?:\/\//.test(r.homepage) ? r.homepage : `https://${r.homepage}`
  const file = `/media/projects/${slug}.jpg`
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: 1440, height: 900 })
    // Settles intro animations so the shot shows the finished page.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45_000 })
    await new Promise((resolve) => setTimeout(resolve, 2500))
    // Cookie banners and toasts pin themselves to the bottom of the viewport.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect()
        const { position } = getComputedStyle(el)
        if ((position === 'fixed' || position === 'sticky') && rect.top > innerHeight / 2) el.remove()
      }
    })
    await page.screenshot({ path: `public${file}`, type: 'jpeg', quality: 82 })

    const previous = covers[slug]?.file
    const shared = Object.entries(covers).some(([other, c]) => other !== slug && c.file === previous)
    if (previous && previous !== file && !shared) {
      await unlink(`public${previous}`).catch(() => {})
    }
    covers[slug] = { file, pushedAt: r.pushed_at }
    console.log(`${slug}: ${url} → ${file}`)
  } catch (error) {
    // Keep the old cover; the next run tries again.
    console.warn(`${slug}: ${url} failed — ${error.message}`)
  } finally {
    await page.close()
  }
}
await browser.close()

const sorted = Object.fromEntries(Object.entries(covers).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`)
