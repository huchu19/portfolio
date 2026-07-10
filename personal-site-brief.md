# Personal Site Brief — Direction for Claude Code

## The core idea

Not a portfolio with a blog bolted on, and not a blog with a projects page. One unified stream of timestamped posts — code, poetry, journal entries, half-formed philosophy, travel notes — all living together, distinguished by type tags rather than separate nav sections. The site itself should feel like a person, not a CV.

Aesthetic direction: **warm, personal, bold, experimental.** Concretely, that means:

- Warm off-white/cream backgrounds rather than stark white or pure black — think paper, not screen
- One unexpected accent color used boldly and sparingly (not a "safe" SaaS blue — pick something with personality: burnt orange, deep ochre, a saturated terracotta)
- Typography does the heavy lifting: pair a expressive serif or slab-serif for headlines/poetry with a clean mono or grotesque sans for body/code. The contrast between the two is where "bold + warm" lives.
- Asymmetry over grids — pull quotes, poetry, and project cards shouldn't all sit in the same rigid card layout. Let post type influence layout (poetry gets generous whitespace and centered verse; code posts get a denser, technical layout; journal entries feel like a notebook page).
- Small, intentional motion (Framer Motion) — text that settles in on scroll, hover states with character — but nothing gimmicky that gets in the way of reading.
- A genuine "About" or "Now" page that reads like a person wrote it, not a resume.

## Content model

Everything is a `post` with a `type` field. No separate top-level sections for projects vs writing vs poetry — just filterable tags on one feed.

```
type frontmatter:
- type: "project" | "essay" | "poetry" | "journal" | "adventure"
- title: string
- date: string
- excerpt: string
- tags: string[]
- coverImage?: string
- readingTime?: auto-computed
- projectLinks?: { live?: string, repo?: string }  // only for type: project
```

Suggested initial seed content:
- Project write-ups for EduNexus, Bamboo, TiflToys, JobHunter — written as narrative posts ("how I built X and what I learned"), not static portfolio tiles
- A poetry category with its own reading-optimized layout (centered, generous line height, no reading-time estimate, no tags clutter)
- Journal/philosophy posts for the personal growth and reflective writing
- Adventure posts for travel between UK/Pakistan and anything else

## Information architecture

- `/` — the feed. Reverse-chronological, all post types mixed, with a slim filter bar (pills: All / Projects / Essays / Poetry / Journal / Adventures). A short, personal intro at the top, not a hero banner.
- `/writing/[slug]` — individual post, layout varies by `type`
- `/about` — the human behind it
- `/archive` — full list, by year, for anyone who wants to dig
- Optional: `/now` — a living "what I'm currently working on / thinking about" page, since you're job hunting and building simultaneously — this is a nice place to surface that without it feeling like a CV

## Tech stack (matches what you already know)

- **Next.js (App Router) + TypeScript + Tailwind** — same stack as TiflToys, so you're not context-switching
- **MDX** for posts (via `next-mdx-remote` or **Velite**, which is lighter than Contentlayer and actively maintained) — lets poetry, code blocks, and embedded React components live in the same file format
- **Framer Motion** for the scroll/hover polish
- **next/font** for self-hosted custom fonts (no FOUT, keeps it fast)
- Deploy on **Vercel** — same as your other projects, trivial custom domain setup later
- Skip a CMS/database entirely — posts as MDX files in the repo is the right amount of complexity for a personal blog. Git becomes your content history.

## Suggested structure

```
/app
  /page.tsx              → feed
  /writing/[slug]/page.tsx
  /about/page.tsx
  /archive/page.tsx
/content
  /posts
    2026-06-tiflwoys-headless-build.mdx
    2026-05-on-leaving-comfort.mdx        (poetry)
    ...
/components
  PostCard.tsx            → renders differently based on type
  PostLayout.tsx          → variant switch: poetry / project / journal / default
  FilterBar.tsx
  Header.tsx / Footer.tsx
/lib
  posts.ts                → reading from /content, sorting, filtering
```

## Prompt to paste into Claude Code

> I'm building a personal blog/portfolio site — warm, personal, bold and experimental aesthetic, NOT a typical minimalist SaaS look. Everything is one unified blog-style feed of timestamped posts (no separate "projects" vs "blog" sections) — post types are: project, essay, poetry, journal, adventure, distinguished by tags/filters on one feed, with type-specific layouts (poetry gets centered generous-whitespace treatment, projects get a more technical layout with live/repo links, journal feels like a notebook entry). Stack: Next.js App Router, TypeScript, Tailwind, MDX via Velite, Framer Motion for subtle scroll/hover motion, next/font for custom typography pairing an expressive serif/slab-serif for headlines and poetry with a clean mono/grotesque sans for body and code. Start by scaffolding the project structure, the content model (MDX frontmatter schema), the feed page with filter pills, and one example post per type so I can see the layout variants. Let's build the homepage feed and post layouts first before anything else.

---

Take this as a starting point, not gospel — once you're in Claude Code and seeing real layouts render, you'll probably want to push the "experimental" parts further than a brief on paper can capture.
