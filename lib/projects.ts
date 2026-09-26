import { cache } from 'react'
import { site } from '@/lib/site'
import { headers, relative, type RepoFacts } from '@/lib/github'
import { formatDate, formatStamp } from '@/lib/posts'
import type { FeedItem } from '@/components/feed/types'
import covers from '@/content/project-covers.json'

/**
 * Projects, straight from GitHub. Every public repo that isn't a fork
 * becomes a project page: the README is the write-up, the repo's
 * homepage is the live link, and its package manifests name the stack.
 *
 * Revalidates hourly, so a new repo appears without a deploy. A failed
 * GitHub request throws on purpose: during revalidation Next keeps
 * serving the last good page, and a failed build keeps the last good
 * deployment, instead of either publishing an empty project list.
 *
 * Covers are screenshots of each live site, refreshed by
 * .github/workflows/project-covers.yml into content/project-covers.json.
 */

const REVALIDATE = 3600

/** Repos that aren't projects: the profile README and this site. */
const EXCLUDE = new Set(['huchu19', 'portfolio'])
/** Tag a repo with this topic to keep it off the site. */
const HIDE_TOPIC = 'hide-from-portfolio'

export type ProjectStatus = 'live' | 'in-progress' | 'archived'

export type Project = {
  type: 'project'
  slug: string
  permalink: string
  /** "huchu19/EOR" */
  repo: string
  title: string
  excerpt: string
  /** when the repo was created — the project's date on the site */
  date: string
  status: ProjectStatus
  stack: string[]
  tags: string[]
  coverImage?: string
  links: { live?: string; repo: string }
  /** The README as GitHub renders it, cleaned for this site's prose styles. */
  html: string
  readingTime: number
  facts: RepoFacts
}

type ApiRepo = {
  name: string
  full_name: string
  description: string | null
  homepage: string | null
  fork: boolean
  archived: boolean
  topics?: string[]
  created_at: string
  pushed_at: string
  stargazers_count: number
  language: string | null
  html_url: string
  default_branch: string
  /** KB; 0 for a repo with nothing pushed yet */
  size: number
}

type CoverEntry = { file: string; pushedAt: string | null }

async function gh(path: string, accept?: string): Promise<Response> {
  const h = headers() as Record<string, string>
  const res = await fetch(`https://api.github.com${path}`, {
    headers: accept ? { ...h, Accept: accept } : h,
    next: { revalidate: REVALIDATE },
  })
  // Rate limits and outages throw; "not found" / "empty repo" are answers.
  if (res.status === 403 || res.status === 429 || res.status >= 500) {
    const hint = process.env.GITHUB_TOKEN ? '' : ' (set GITHUB_TOKEN: unauthenticated requests are capped at 60/hour)'
    throw new Error(`GitHub ${path} answered ${res.status}${hint}`)
  }
  return res
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const res = await gh(`/users/${site.githubUser}/repos?type=owner&per_page=100`)
  if (!res.ok) throw new Error(`GitHub user ${site.githubUser} not found`)
  const repos = (await res.json()) as ApiRepo[]

  const projects = await Promise.all(
    repos
      .filter(
        (r) =>
          !r.fork &&
          r.size > 0 &&
          !EXCLUDE.has(r.name.toLowerCase()) &&
          !r.topics?.includes(HIDE_TOPIC),
      )
      .map(toProject),
  )
  // Most recently worked on first.
  return projects.sort((a, b) => b.facts.pushedAt.localeCompare(a.facts.pushedAt))
})

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug)
}

/** The lean shape the command palette renders. */
export function toFeedItem(project: Project): FeedItem {
  return {
    type: 'project',
    title: project.title,
    permalink: project.permalink,
    stamp: formatStamp(project.date),
    dateLabel: formatDate(project.date),
    tags: project.tags,
    lang: 'en',
    excerpt: project.excerpt,
    stack: project.stack,
    status: project.status,
    readingTime: project.readingTime,
  }
}

async function toProject(r: ApiRepo): Promise<Project> {
  const slug = r.name.toLowerCase()
  const [readmeRes, langRes, manifests] = await Promise.all([
    gh(`/repos/${r.full_name}/readme`, 'application/vnd.github.html+json'),
    gh(`/repos/${r.full_name}/languages`),
    getManifests(r),
  ])
  const readme = cleanReadme(
    readmeRes.ok ? await readmeRes.text() : '',
    r.full_name,
    r.default_branch,
  )
  const languages = langRes.ok ? ((await langRes.json()) as Record<string, number>) : {}
  const cover = (covers as Record<string, CoverEntry>)[slug]

  return {
    type: 'project',
    slug,
    permalink: `/projects/${slug}`,
    repo: r.full_name,
    title: readme.title || prettify(r.name),
    excerpt: clamp(readme.excerpt || r.description?.trim() || `${prettify(r.name)} on GitHub.`, 280),
    date: r.created_at,
    status: statusOf(r),
    stack: detectStack(manifests, languages),
    tags: r.topics ?? [],
    coverImage: cover?.file ?? readme.image,
    links: {
      live: r.homepage ? (/^https?:\/\//.test(r.homepage) ? r.homepage : `https://${r.homepage}`) : undefined,
      repo: r.html_url,
    },
    html: readme.html,
    readingTime: Math.max(1, Math.round(readme.words / 220)),
    facts: {
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      languages,
      pushedAt: r.pushed_at,
      pushedLabel: relative(r.pushed_at),
      url: r.html_url,
    },
  }
}

function statusOf(r: ApiRepo): ProjectStatus {
  if (r.archived) return 'archived'
  const wip =
    r.topics?.some((t) => t === 'wip' || t === 'in-progress') ||
    /\bwip\b|work in progress/i.test(r.description ?? '')
  if (wip) return 'in-progress'
  return r.homepage ? 'live' : 'in-progress'
}

/* ------------------------------------------------------------------ */
/*  Stack — read from package.json / requirements.txt / pyproject     */
/* ------------------------------------------------------------------ */

const MANIFEST = /(^|\/)(package\.json|requirements\.txt|pyproject\.toml)$/

/** Manifests at the root or one folder down (frontend/, backend/, …). */
async function getManifests(r: ApiRepo): Promise<string[]> {
  const res = await gh(`/repos/${r.full_name}/git/trees/${r.default_branch}?recursive=1`)
  if (!res.ok) return []
  const tree = (await res.json()) as { tree: Array<{ path: string; type: string }> }
  const paths = tree.tree
    .filter((t) => t.type === 'blob' && MANIFEST.test(t.path))
    .map((t) => t.path)
    .filter((p) => p.split('/').length <= 2 && !p.includes('node_modules'))
    .slice(0, 6)

  // raw.githubusercontent.com doesn't count against the API rate limit.
  const files = await Promise.all(
    paths.map(async (p) => {
      const file = await fetch(
        `https://raw.githubusercontent.com/${r.full_name}/${r.default_branch}/${p}`,
        { next: { revalidate: REVALIDATE } },
      )
      return file.ok ? file.text() : ''
    }),
  )
  return files
}

/** In display order; a label shows when any of its packages is a dependency. */
const STACK: Array<[label: string, packages: string[]]> = [
  ['Next.js', ['next']],
  ['React', ['react']],
  ['React Native', ['react-native']],
  ['Expo', ['expo']],
  ['Vue', ['vue']],
  ['SvelteKit', ['@sveltejs/kit']],
  ['Astro', ['astro']],
  ['Express', ['express']],
  ['NestJS', ['@nestjs/core']],
  ['FastAPI', ['fastapi']],
  ['Django', ['django']],
  ['Flask', ['flask']],
  ['Tailwind CSS', ['tailwindcss']],
  ['Sanity', ['sanity', 'next-sanity', '@sanity/client']],
  ['Shopify Storefront API', ['@shopify/hydrogen-react', '@shopify/storefront-api-client', '@shopify/hydrogen']],
  ['Prisma', ['prisma', '@prisma/client']],
  ['Drizzle', ['drizzle-orm']],
  ['Supabase', ['@supabase/supabase-js', '@supabase/ssr']],
  ['Firebase', ['firebase', 'firebase-admin']],
  ['MongoDB', ['mongodb', 'mongoose']],
  ['PostgreSQL', ['pg', 'postgres', '@neondatabase/serverless', 'psycopg', 'psycopg2', 'psycopg2-binary', 'asyncpg']],
  ['SQLAlchemy', ['sqlalchemy']],
  ['Stripe', ['stripe', '@stripe/stripe-js']],
  ['Gemini', ['@google/genai', '@google/generative-ai', 'google-genai', 'google-generativeai']],
  ['OpenAI', ['openai']],
  ['Claude API', ['@anthropic-ai/sdk', 'anthropic']],
  ['Framer Motion', ['framer-motion', 'motion']],
  ['Three.js', ['three']],
  ['Fuse.js', ['fuse.js']],
  ['Storybook', ['storybook']],
  ['Playwright', ['@playwright/test', 'playwright']],
]

/** Languages worth a chip — markup and build glue aren't a stack. */
const LANGUAGES = new Set(['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'Dart', 'C#', 'C++', 'C', 'Ruby', 'PHP'])

function detectStack(manifests: string[], languages: Record<string, number>): string[] {
  const deps = new Set<string>()
  for (const text of manifests) {
    try {
      const pkg = JSON.parse(text) as Record<string, Record<string, string> | undefined>
      for (const key of ['dependencies', 'devDependencies']) {
        Object.keys(pkg[key] ?? {}).forEach((d) => deps.add(d.toLowerCase()))
      }
    } catch {
      // requirements.txt / pyproject.toml: take the leading name of each line
      for (const m of text.matchAll(/^\s*["']?([A-Za-z0-9_.-]+)/gm)) deps.add(m[1].toLowerCase())
    }
  }

  const found = STACK.filter(([, pkgs]) => pkgs.some((p) => deps.has(p))).map(([label]) => label)
  // Next.js and Expo imply React; saying both is noise.
  const frameworks = found.filter(
    (l) => !(l === 'React' && (found.includes('Next.js') || found.includes('Expo'))),
  )
  const langs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .filter((name) => LANGUAGES.has(name))
    .slice(0, 2)
  return [...frameworks.slice(0, 5), ...langs].slice(0, 6)
}

/* ------------------------------------------------------------------ */
/*  README — GitHub's own render, trimmed to plain prose markup       */
/* ------------------------------------------------------------------ */

type Readme = {
  html: string
  title?: string
  excerpt?: string
  image?: string
  words: number
}

const BADGE = /shields\.io|badgen\.net|\/badge\b/i

function cleanReadme(raw: string, repo: string, branch: string): Readme {
  let html = raw.match(/<article[^>]*>([\s\S]*)<\/article>/)?.[1] ?? raw

  // Headings arrive wrapped with a permalink icon; keep a plain heading
  // whose id matches the README's own #anchor links.
  html = html.replace(
    /<div class="markdown-heading"[^>]*>\s*<(h[1-6])[^>]*>([\s\S]*?)<\/\1>\s*<a id="user-content-([^"]+)"[^>]*>[\s\S]*?<\/a>\s*<\/div>/g,
    '<$1 id="$3">$2</$1>',
  )

  // The first h1 is the project's name — the page header already shows it.
  let title: string | undefined
  html = html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/, (_, inner: string) => {
    title = toText(inner).replace(/[\p{Extended_Pictographic}️‍]/gu, '').trim()
    return ''
  })

  // Badges read as noise off GitHub.
  html = html
    .replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/g, (m) => (BADGE.test(m) ? '' : m))
    .replace(/<img[^>]*>/g, (m) => (BADGE.test(m) ? '' : m))

  // Mermaid only draws with GitHub's script; render it as an image instead.
  html = html.replace(/<section[^>]*data-type="mermaid"[\s\S]*?<\/section>/g, (m) => {
    const json = m.match(/data-json="([^"]*)"/)?.[1]
    if (!json) return ''
    try {
      const source = (JSON.parse(decodeEntities(json)) as { data: string }).data
      const encoded = Buffer.from(source).toString('base64url')
      // PNG, not SVG: mermaid.ink measures text in the browser it renders
      // in, so labels in its SVGs clip once another font draws them.
      return `<p><img src="https://mermaid.ink/img/${encoded}?type=png&amp;theme=neutral&amp;width=1400" alt="Diagram" loading="lazy"></p>`
    } catch {
      return ''
    }
  })
  html = html
    .replace(/<section[^>]*js-render-needs-enrichment[\s\S]*?<\/section>/g, '')
    .replace(/<\/?markdown-accessiblity-table>/g, '')

  // Relative paths point into the repo, not at this site.
  const rawBase = `https://raw.githubusercontent.com/${repo}/${branch}/`
  const blobBase = `https://github.com/${repo}/blob/${branch}/`
  html = html
    .replace(/(<img[^>]*?\ssrc=")([^"]+)"/g, (_, pre: string, src: string) => `${pre}${absolute(src, rawBase)}"`)
    .replace(/(<a[^>]*?\shref=")([^"#][^"]*)"/g, (_, pre: string, href: string) => `${pre}${absolute(href, blobBase)}"`)
    .replace(/<p[^>]*>\s*<\/p>/g, '')
    .trim()

  // The first real sentence of prose — not a bold tagline or credit line.
  const firstParagraph = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .filter((m) => !/^\s*<(strong|em)>[\s\S]*<\/\1>\s*$/.test(m[1]))
    .map((m) => toText(m[1]))
    .find((t) => t.length >= 40)
  const image = html
    .match(/<img[^>]*?\ssrc="([^"]+)"/g)
    ?.map((tag) => tag.match(/src="([^"]+)"/)![1])
    .find((src) => !src.startsWith('https://mermaid.ink'))

  return {
    html,
    title: title || undefined,
    excerpt: firstParagraph,
    image,
    words: toText(html).split(' ').filter(Boolean).length,
  }
}

function absolute(url: string, base: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) return url
  return new URL(url.replace(/^\.?\//, ''), base).href
}

function toText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:!?)])/g, '$1')
    .trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/** "TiflToysFrontend" → "Tifl Toys Frontend", "club-launch" → "Club Launch". */
function prettify(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`
}
