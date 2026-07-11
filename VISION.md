# VISION.md — Khwabon ka Bagh: A Universe, Not a Portfolio

> خوابوں کا یہ باغ جلتا بھی رہے تو کیا
> راکھ سے بھی ایک نیا انقلاب پیدا ہوتا ہے
>
> Even if this garden of dreams keeps burning,
> from ashes too, a new revolution is born.

This document replaces `BRIEFS.md` and `personal-site-brief.md` entirely.
The old "field notes / printed matter" direction is dead.
This is the design constitution for what replaces it.

---

## Part 0: Who this is and what this isn't

This is **not** a portfolio with a blog bolted on. This is not a dev site with personality sprinkled in. This is a *universe* — a home for every facet of a 22-year-old who contains multitudes:

- **Software engineer** building Next.js apps, AI platforms, e-commerce stores
- **Urdu poet** who writes ghazals about gardens that burn and bloom
- **Manga reader** whose philosophy of life was shaped by Berserk and Vagabond
- **Muslim** whose religious conclusions are earned, not inherited
- **Philosopher** drawing equally from Iqbal, Camus, Rumi, Mahmoud Darwish, and Miyamoto Musashi
- **Comedian** with satirical instincts (Robot Takes Your Job wasn't an accident)
- **Football romantic** who sees FC Barcelona's tiki-taka as a metaphor for life: delusionally optimistic, committed to beauty over pragmatism, believing when no one else does
- **Wanderer** between Karachi and London, Urdu and English, East and West
- **Collector of thoughts** — images, passages, recordings, poetry, one-line reactions to things that moved him

The site must hold ALL of this without making any part feel like a sidebar. A ghazal lives next to a project writeup lives next to a Barça match reaction lives next to a philosophical conclusion lives next to a meme. Not because the site is chaotic, but because the person is whole.

**The philosophy that runs through everything:** Delusional optimism. Sarfaroshi ki tamanna — the desire for revolution, for beauty, for the impossible goal. The seed that asks for darkness. Guts walking forward. Musashi asking "do you see how infinite you are?" Barça pressing from the front at 3-1 down. Building things at 3am because the dream demands it.

---

## Part 1: Why the old direction died

The v1 was a "printed matter" broadsheet — bone paper (#F4EFE6), terracotta (#BC4A18), Fraunces italic, film grain, postal stamps, debossed date stamps, entry numbering (№ 01), dead letter offices.

It was beautifully crafted. It was also someone else's aesthetic — a 38-year-old Kinfolk subscriber's, not a 22-year-old who saves Guts walking through fire and Nastaliq over mountains to his camera roll.

**Specifically:**
- Warmth came from *nostalgia* (old journals, letterpress) instead of *intensity* (fire, ambition, growth through darkness)
- Terracotta is dried clay. A color that already cooled. The real palette is amber fire against deep night
- Zero Urdu on a site by someone whose phone wallpaper is Nastaliq script over the Himalayas
- Navigation was completely conventional (header → scroll → click)
- The "broadsheet" metaphor made content feel *archived*. Content should feel *alive*
- No room for quick fragments — images, links, reactions, recordings. Only full "posts"
- No room for comedy, football, religion, or anything outside the literary-programmer persona

**What to salvage:**
- The content pipeline (Velite + MDX + Next.js App Router)
- `lib/posts.ts` sorting logic (adapt, don't rewrite)
- `tools/shot.mjs` screenshot critique tool
- The 5 existing MDX files in `content/posts/` (keep as seed content)
- The accessibility discipline: `prefers-reduced-motion`, `document.hidden`, semantic HTML, focus states
- The custom easing principle: `cubic-bezier(.22,1,.36,1)` on every transition
- The idea that different content types deserve different layouts

**Delete everything else.** Every component, the entire CSS, the ink effects, the paper metaphor. Start fresh.

---

## Part 2: The golden ratio — navigation redefined

The golden ratio (φ ≈ 1.618) isn't just an accent. It's the structural DNA of the entire site. It defines how content is proportioned, how sections relate to each other, and how you navigate through the universe.

### Three approaches (choose one or hybrid):

---

### OPTION A: The Fibonacci Zoom (RECOMMENDED)

**Concept:** The homepage presents a visible golden ratio grid — the classic nested fibonacci rectangles rendered as thin construction lines (like the nautilus wireframe art from inspiration). Each major rectangle IS a section of the site. As you scroll vertically, the viewport *zooms into* the next fibonacci rectangle, revealing the content within it. The spiral line connects them all.

**How it works:**
1. On load, the full golden ratio grid is visible at macro scale — a beautiful SVG construction drawing. The largest rectangle contains the intro/name. The next rectangle shows the feed preview. The next shows featured work. And so on, spiraling inward.
2. Scrolling down triggers a smooth zoom-and-pan transition into the next rectangle. The fibonacci construction lines stay visible as context during the transition, then fade to background once you've "entered" a section.
3. Each section has normal scroll within it for reading content.
4. The golden spiral SVG persists as a subtle navigation element — a thin line in the margin showing where you are in the overall structure.
5. Clicking the spiral or using keyboard shortcuts jumps between sections.

**Technical approach:**
- Full-viewport sections (`100vh`) for each fibonacci rectangle
- CSS `transform: scale()` + `translate()` for zoom transitions, driven by scroll position via `IntersectionObserver` or Framer Motion's `useScroll`
- The fibonacci grid as an SVG overlay with `pointer-events: none`
- On mobile: the zoom effect is simplified to section-snap scrolling, but the spiral navigation line persists as a sidebar progress indicator

**Why this is the one:** It literally uses the golden ratio as the navigational structure. The visitor *travels the spiral*. Every section's proportions are mathematically derived. It's technically ambitious but achievable, and it's the kind of thing that makes someone stop and send the link to their friends.

---

### OPTION B: The Spiral River

**Concept:** A vertical scroll, but content follows a path that traces the golden spiral down the page. A visible SVG spiral construction line runs through the page. Content panels are placed along this path — alternating left and right, scaling in size according to fibonacci proportions.

**How it works:**
1. The page scrolls vertically (familiar behavior)
2. An SVG golden spiral path is drawn as a thin construction line running down the center
3. Content panels sit at the nodes of the spiral — some large (projects, featured essays), some small (fragments, quick thoughts), sized by fibonacci ratios (1×, 1×, 2×, 3×, 5×, 8× units)
4. As you scroll, the spiral line draws itself progressively (stroke-dashoffset animation)
5. Content panels fade in as they enter the viewport, timed to the spiral's path

**Tradeoff:** More conventional scrolling behavior (lower learning curve for visitors) but less "redefining web design." Good middle ground.

---

### OPTION C: The Golden Grid (Simplest)

**Concept:** The feed page uses a CSS Grid where panel sizes follow fibonacci proportions. The grid layout itself IS the golden rectangle, subdivided recursively. Different content types are assigned to different rectangles. The spiral is drawn as an SVG overlay on the grid.

**How it works:**
1. CSS Grid with explicit areas following the golden rectangle subdivision: the largest area is `8fr`, the next is `5fr`, then `3fr`, `2fr`, `1fr`, `1fr`
2. Content panels fill these grid areas, with post types mapped to sizes (projects → largest, poetry → tall and narrow, fragments → smallest)
3. The golden spiral is drawn as a thin SVG overlay connecting the grid areas
4. Scrolling is standard vertical scroll — the grid is just the visual composition
5. On mobile, it collapses to a single column but maintains proportional height ratios

**Tradeoff:** Least technically risky, easiest for Claude Code to implement in one session. But it's more "golden ratio as layout principle" than "golden ratio as navigation paradigm."

---

### Implementation note for Claude Code:

**Build Option A** (Fibonacci Zoom) as the primary experience, with a **fallback to Option C** (Golden Grid) for mobile and for users with `prefers-reduced-motion`. This gives you the ambitious desktop experience and a solid mobile fallback.

If Option A proves too complex in a single session, fall back entirely to Option C for the initial build and leave the zoom transitions as a documented TODO.

---

## Part 3: The content model (expanded)

The old model had 5 types: project, essay, poetry, journal, adventure. That's too narrow. The new model adds **fragments** — the quick, casual, raw postings that make the site feel *alive* rather than *curated*.

### Post types:

```
type: "project"    — full writeup of something built
type: "essay"      — long-form thinking (philosophy, religion, tech)
type: "poetry"     — ghazals, verse, both Urdu and English
type: "journal"    — personal reflections, dated entries
type: "adventure"  — travel, routes, places
type: "fragment"   — NEW: the lifeblood of the living site
```

### Fragments

Fragments are micro-content. They're what make this a *living universe* instead of a *static portfolio*. A fragment can be:

- An image with a 1-3 sentence reaction
- A link to a passage or article with a quick thought
- A recording (audio link) with context
- A screenshot of Urdu poetry with translation and commentary
- A football reaction ("Lamine at 17 doing things that shouldn't be legal")
- A philosophical one-liner
- A manga panel that hit different, with why
- A meme or satirical observation
- A favourite quote with the source

**Frontmatter for fragments:**
```yaml
type: fragment
title: optional (can be empty — fragments don't need titles)
date: 2026-07-11
tags: [football, philosophy, comedy, poetry, manga, religion, music, tech]
media: optional image/audio path
link: optional URL
lang: "en" | "ur" | "both"
```

**In the feed:** Fragments appear as small panels in the golden grid — they're the 1×1 and 1×2 fibonacci units while full posts get the larger rectangles. They create rhythm and texture between the bigger pieces.

**The key principle:** Adding a fragment should be as easy as creating a new `.mdx` file with 3-5 lines of frontmatter and 1-3 sentences of body text. No friction. The site should accumulate fragments like a garden accumulates flowers.

### Updated frontmatter schema (all types):

```yaml
---
title: string
slug: string
date: YYYY-MM-DD
type: project | essay | poetry | journal | adventure | fragment
excerpt: string (optional for fragments)
tags: string[]
lang: "en" | "ur" | "both"  # NEW — declares primary language
coverImage: string (optional)
readingTime: auto-computed (skip for fragments and poetry)
projectLinks:
  live: string (optional)
  repo: string (optional)
route: string (optional, for adventures — "LHR → DXB → KHI")
media: string (optional, for fragments — image/audio path)
link: string (optional, for fragments — external URL)
---
```

---

## Part 4: Aesthetic direction

### Philosophy: precision × rawness

The site's visual identity lives in the tension between mathematical precision (golden ratio, construction lines, fibonacci grids) and raw organic energy (fire, growth through cracks, ink, ambition). Think: the wireframe nautilus with watercolor bleeding through the lines. Or the Great Wave of Kanagawa composed inside a golden spiral.

### Palette

Dark-first. The darkness of a Pakistani mountain night with fire in the foreground.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#0C0A08` | Primary background. Warm near-black, not cold. |
| `--void-raised` | `#161210` | Elevated surfaces, panels, cards |
| `--void-line` | `#2A2420` | Borders, construction lines, gutters |
| `--ash` | `#8C7E6E` | Muted text, secondary labels |
| `--bone` | `#E8DFD0` | Primary text on dark ground |
| `--white` | `#F5F0E8` | Display text, highest emphasis |
| `--ember` | `#E07A2F` | Primary accent — amber fire, NOT terracotta |
| `--ember-bright` | `#F09940` | Accent hover states, large display |
| `--ember-deep` | `#B85A1A` | Accent text at body sizes (AA contrast) |
| `--wave` | `#3A6B8C` | Secondary accent — the Kanagawa blue. Used sparingly for links, code highlights, route strips. Cool contrast to the warm ember. |
| `--ink` | `#1A1714` | Text on light surfaces (if light mode) |

Light mode is secondary and optional. Dark IS the identity.

### Typography

**Display:** Instrument Serif — sharp, Italian editorial, has a distinctive italic. Young without being trendy. Used large and with restraint: page titles, the site name, ghazal display, pull quotes. If Instrument Serif isn't available via `next/font`, fall back to Playfair Display.

**Body:** Inter — clean, modern, excellent readability at all sizes. It's the calm voice between moments of intensity. 16-17px, line-height 1.7+, max-width 66ch.

**Mono:** Geist Mono or IBM Plex Mono — dates, tags, metadata, code blocks, route strips, stack chips. Always uppercase with letter-spacing for labels. Tabular figures.

**Nastaliq:** Noto Nastaliq Urdu — loaded on-demand for pages with Urdu text. This is NOT decorative. It's structural. Used with `dir="rtl"` and `lang="ur"` attributes. Right-aligned per Urdu reading direction.

### The construction line layer

A subtle SVG overlay at ~3-4% opacity: the golden ratio grid drawn as thin lines. Not graph paper — architectural draft lines. This replaces the old film grain and vignette. It should feel like the background of the fibonacci wireframe art from your inspiration images.

The construction lines become more visible in the golden ratio navigation (Part 2) — they're faint context when reading content, but become the structural guide during transitions between sections.

### Motion language

Every transition: `var(--ease): cubic-bezier(.22,1,.36,1)`. Every animation respects `prefers-reduced-motion`. Every rAF loop pauses on `document.hidden`.

- **Content emergence:** Fade up from below with subtle scale (0.98→1). Content *surfaces* from darkness, doesn't slide in from the side.
- **Panel hover:** Lift (translateY -2px) + ember edge-glow. Panels breathe.
- **The spiral draw:** The golden spiral SVG draws itself via stroke-dashoffset as you scroll. The line is always slightly ahead of you — leading you forward.
- **Poetry reveal:** Lines emerge from 0→1 opacity with no positional shift. Like ink developing on paper. Staggered per line, ~120ms delay.
- **Section transitions (Option A):** Smooth zoom + pan into the next fibonacci rectangle. Duration: 600-800ms. The construction lines scale with the zoom to maintain visual continuity.
- **Cursor element:** Replace the old ink ghost blob with a thin geometric ring or crosshair that follows the pointer. Construction-line energy, not wet-ink energy. Disappears on touch devices.

### `::selection`

Background: `--ember`. Color: `--void`.

---

## Part 5: Surface briefs

### The Fibonacci Homepage (`/`)

**Concept:** The landing experience. On desktop, this is the golden ratio grid/zoom experience (Option A or C from Part 2). The full fibonacci rectangle is visible, subdivided into sections, with the golden spiral drawn over it. Each rectangle contains a different aspect of the universe:

- **Largest rectangle (8-unit):** The intro. Name in display face at massive scale. A rotating line from the ghazal in Nastaliq underneath. One sentence: "Software engineer. Urdu poet. Delusional optimist." — or something equally compressed and honest.
- **Second rectangle (5-unit):** The feed — the panel grid of recent posts and fragments, scrollable within its container. Filter pills here: All / Projects / Essays / Poetry / Fragments / Journal / Adventures.
- **Third rectangle (3-unit):** Featured project or essay — the one thing you most want someone to see right now.
- **Fourth rectangle (2-unit):** The /now telemetry — currently building, reading, watching, job-hunt status.
- **Remaining rectangles (1-units):** Quick links — About, Archive, Colophon. Or a favourite fragment.

On **mobile**, this collapses to a single-column scroll with the spiral as a thin progress line on the side. Sections stack vertically with fibonacci-proportioned heights.

### The Feed (within homepage or at `/feed`)

The feed is the panel grid. Different post types get different panel treatments:

- **Project:** Wide panel, full or 3/4 width. Dense: title, stack chips (mono), status badge, 2-line excerpt, live/repo links. Dark with `--void-raised` background. Ember accent on the status badge or a left border.
- **Essay:** Medium panel. Strong headline in display, reading time in mono, 2-line excerpt. The headline does the work.
- **Poetry:** Tall, narrow panel. Maximum negative space. The first line of the poem in large display face, ghosted at ~40% opacity. If Urdu, show in Nastaliq. No metadata clutter.
- **Journal:** Small panel. Date dominant (large mono), title secondary. Feels like a margin note.
- **Adventure:** Medium panel with route strip (`LHR → DXB → KHI`) as the primary visual. Mono chips connected by a thin SVG line.
- **Fragment:** Smallest panels. 1×1 in the grid. Just the fragment text, maybe a thumbnail if it's an image fragment. Tagged with a colored dot: ember for philosophy/religion, wave-blue for tech, green for football, etc. Fragments give the feed its *pulse* — they're the small panels between the big ones that make the grid feel alive.

**Filtering:** Minimal text toggles. Active filter underlined with `--ember`. URL-synced via `?type=`. Include filter for fragments specifically, and tag-based sub-filtering within fragments.

### Poetry Layout

The most artistically important layout. This is where the ghazal lives.

- Centered on dark ground. Display face at generous size (clamp, responsive).
- **Bilingual support:** When `lang: "both"`, show Urdu in Nastaliq (right-aligned, `dir="rtl"`) and English translation below in body sans (left-aligned). Visual separation between the two via a thin `--void-line` hairline or generous spacing.
- **When `lang: "ur"` only:** Full Nastaliq, right-aligned, generous leading.
- Maximum negative space. The darkness IS the design — the poem is light emerging from void.
- No metadata above the fold. No reading time, no tags, no clutter. Date and tags at the very bottom, barely there in `--ash`.
- **Motion:** Lines reveal on scroll with opacity fade, staggered. Under `prefers-reduced-motion`, all lines visible immediately.

### Project Layout

Dense dossier energy.

- **Header:** Title in display face, stack chips in mono (`Next.js · TypeScript · Tailwind · FastAPI`), status badge (Live / In Progress / Archived), live + repo link buttons.
- **Body:** Narrative "how I built X" in body sans, 66ch measure. Written as a story, not a spec sheet.
- **Code blocks:** On `--void-raised` panel. Syntax highlighting that uses `--ember` and `--wave` as accent colors.
- **Screenshots/demos:** If provided, full-bleed within the content column.

### Essay Layout

- Big display headline.
- Body: 66ch, generous leading, justified with hyphens on desktop (ragged on mobile).
- Pull quotes in display face at 1.5× body size, with `--ember` left border.
- Footnotes in the outer gutter on wide screens, inline disclosure on mobile.
- This layout should handle philosophy, religious conclusions, tech essays, and match analyses equally well. The layout is neutral; the content brings the energy.

### Journal Layout

- Date dominant (display mono, large).
- Intimate measure (narrower than 66ch — maybe 55ch).
- Slightly indented from full width. Feels like a margin note to the rest of the site.
- Quieter palette — less contrast, more `--ash` and `--bone`, fewer `--ember` accents.

### Adventure Layout

- Route strip header: `LHR → DXB → KHI` in mono with thin SVG path connecting nodes. The path draws itself on load.
- Cover image support (full-bleed, bleeds to edges).
- Mile-marker section numbering for long travelogues.
- Map embed support (optional, for future).

### Fragment Layout (in-feed only — fragments don't get their own page by default)

Fragments are primarily consumed in the feed. They can optionally have a permalink page, but it's minimal — just the fragment content, centered on the void, with prev/next navigation.

- **Image fragment:** Thumbnail in the feed panel, full image on the permalink page.
- **Link fragment:** The URL domain shown in mono, the thought below it.
- **Quote fragment:** The quote in display italic, attribution in mono.
- **Football fragment:** Same as any fragment, but with a colored tag dot.

### About (`/about`)

First person, warm, honest, wide-ranging. This page should feel like sitting across from Hussain at a late-night chai spot and asking "so what's your deal?"

It should mention: code AND poetry, London AND Karachi, Berserk AND Iqbal, Barça AND religious faith, comedy AND seriousness. Not as a list — woven into a narrative that feels natural.

No images required. Typography and negative space do the work. Maybe a few lines from the ghazal as section breaks.

**The bilingual moment:** Part of the About could be in Urdu (with Nastaliq), translated below. Not the whole page — just a paragraph or a verse. Enough to say "this is who I am in my mother tongue."

### Now (`/now`)

Telemetry board. What's happening right now.

Grid of status cards on `--void-raised`:
- **Building:** Current projects with status dots (ember = active, ash = paused)
- **Reading:** Book + author
- **Watching:** Anime/shows (yes, include this)
- **Listening:** If relevant
- **Job hunt:** Status, target roles, companies
- **Thinking about:** A one-sentence current philosophical preoccupation
- **Location:** London / Karachi / wherever

Mono-flavored, dense but warm. "Last updated" timestamp at the top.

### Archive (`/archive`)

The index. Every post and fragment ever, organized by year.

- Years as large section heads
- Posts: date (mono) + type indicator (colored dot or glyph) + title (display face) + tags (mono, muted)
- Fragments: date + first line of text (truncated) + tag
- Scannable, dense, beautiful. "A list can be a pleasure."

### Colophon (`/colophon`)

How this site was made. References the golden ratio structure, the Fable 5 / Claude Code process, the design thinking, the philosophical influences. Self-aware without being self-important. Mentions that the construction lines are real fibonacci ratios, not decoration.

### 404

> "The place you want to go... is more distant, farther off.
> So... it's all right. You'll stand up. And you'll start walking."
> — Berserk

Minimal: the quote (or something like it, rewritten to avoid copyright), a link home, vast empty dark space. The 404 page should feel like a pause in the journey, not an error.

---

## Part 6: The bilingual identity

Hussain's Pinterest is 40%+ Urdu/Persian/Arabic poetry. His phone wallpaper has Nastaliq on it. His ghazal is in Urdu. This is structural identity.

**Implementation:**

- **Site intro:** The tagline or a verse from the ghazal appears in Nastaliq on the homepage
- **Poetry posts:** Urdu poems in Nastaliq with `dir="rtl"`, English translations alongside or below
- **Fragment quotes:** When quoting Urdu poetry (Faiz, Iqbal, Ghalib, etc.), display in original script with translation
- **Section headings:** Some section titles can appear bilingually. Not every one — just enough to feel natural
- **The About page:** Has at least one paragraph or verse in Urdu
- **Font loading:** Noto Nastaliq Urdu loaded on-demand via `next/font` with `font-display: swap`. Subset if possible. Only loaded on pages/components that use Urdu text.
- **HTML attributes:** Always use `lang="ur"` and `dir="rtl"` on Urdu text containers

---

## Part 7: The FC Barcelona / delusional optimism thread

This isn't a separate section. It's a *philosophy that runs through everything.*

Hussain's connection to Barça is philosophical, not just fandom. Barça's identity — playing beautiful football when pragmatism would be easier, pressing from the front when defending would be safer, believing in la Masia when buying stars would be simpler — maps directly onto:

- Writing ghazals when you could be grinding LeetCode
- Building experimental portfolio navigation when a template would get the same job done
- Maintaining bilingual identity when assimilation would be smoother
- Being delusionally optimistic about your dreams when the job market says otherwise

**Sarfaroshi ki tamanna ab hamare dil mein hai / Dekhna hai zor kitna bazoo-e-qatil mein hai** — this isn't just a football chant reframe, it's a life stance. The desire for revolution IS in the heart. And we'll see how strong the opposition really is.

**How it shows up in the site:**
- Football fragments appear naturally in the feed, tagged and colored
- The About page can reference this philosophy without making it a section called "Football"
- The overall design ethos IS this philosophy: beautiful over pragmatic, ambitious over safe
- Maybe a future essay post exploring this connection explicitly

---

## Part 8: Technical implementation

### Stack (unchanged)

- Next.js 14+ (App Router) — TypeScript
- Tailwind CSS v4+
- MDX via Velite
- Framer Motion (scroll-driven animations, layout transitions, zoom effects)
- `next/font` for all font loading
- Deploy on Vercel

### New dependencies (may be needed)

- `framer-motion` `useScroll` + `useTransform` for the fibonacci zoom transitions
- Possibly `@studio-freight/lenis` or similar for smooth scroll (evaluate if native CSS `scroll-behavior: smooth` + Framer is sufficient)
- SVG path animation utilities (or hand-rolled with stroke-dasharray/dashoffset)

### File structure (revised)

```
/app
  page.tsx              → fibonacci homepage
  /writing/[slug]/page.tsx → individual post
  /about/page.tsx
  /now/page.tsx
  /archive/page.tsx
  /colophon/page.tsx
  not-found.tsx
  globals.css           → complete token system
  layout.tsx            → root shell + font loading
  template.tsx          → page transition wrapper
  robots.ts
  sitemap.ts
/components
  /golden              → fibonacci grid, spiral SVG, zoom controller
  /feed                → panel grid, filter bar, panel variants per type
  /layouts             → per-type post layouts (poetry, project, essay, journal, adventure, fragment)
  /ui                  → command palette, header, footer, cursor, progress indicator
  /typography          → bilingual text components, Nastaliq wrapper
/content
  /posts               → full posts (MDX)
  /fragments           → fragments (MDX, lightweight)
/lib
  posts.ts             → reading + sorting + filtering
  golden.ts            → fibonacci math utilities (ratios, grid calculations)
  site.ts              → site metadata
/tools
  shot.mjs             → screenshot critique tool
```

### The command palette

Primary navigation tool. Triggered by `⌘K` (desktop) or a search/menu icon (mobile).

- Instant search across all posts and fragments
- Results grouped by type with colored indicators
- Keyboard navigable (arrow keys + enter)
- Shows recent posts and quick links when empty
- Styled on `--void-raised` with `--ember` highlights on focused result
- Built with Framer Motion for enter/exit transitions

### Minimal header

- Site name in display face (or Nastaliq) — left-aligned
- Command palette trigger icon — right-aligned
- That's it. No nav links. The command palette and the feed ARE the navigation.
- On scroll: header compresses to a thin bar with just the name + trigger
- On mobile: same, but the trigger is a small icon button

---

## Part 9: The golden ratio math (reference for implementation)

```
φ (phi) = 1.6180339887...
1/φ = 0.6180339887...

Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...

Golden rectangle subdivision:
- Start with rectangle of ratio 1:φ (e.g., 1000px × 618px)
- Remove a square (618×618) → remaining rectangle is 618×382 (another golden rectangle)
- Remove a square (382×382) → remaining: 382×236
- Continue recursively

For CSS Grid, use fibonacci fractions:
- 8fr + 5fr = 13 total columns
- Or: 61.8% / 38.2% split at each level

For panel sizing:
- Large panels: span 8 units
- Medium panels: span 5 units
- Small panels: span 3 units
- Fragment panels: span 2 or 1 units
```

The golden spiral SVG can be drawn as a series of quarter-circle arcs, each with radius equal to the fibonacci number at that level, centered at the corner of each square. Use `<path>` with arc commands.

---

## Part 10: Non-negotiable rules

1. **Dark ground by default.** Warm near-black (`--void`). Not paper. Not cream.
2. **The golden ratio is structural, not decorative.** Proportions, grid sizing, and navigation derive from φ. It's not a background image — it's the architecture.
3. **Ember accent at ≤10% coverage.** Fire, not paint.
4. **Bilingual is native.** Urdu text appears with Nastaliq, RTL direction, and proper `lang` attributes. Not decoration.
5. **Fragments are first-class content.** They appear in the feed alongside full posts. The site must be easy to add to casually, not just when writing a full essay.
6. **No nostalgia.** Nothing that smells like letterpress, postal stamps, field notes, or dried anything. Warmth comes from fire, not memory.
7. **Every aspect of identity has a home.** Comedy next to philosophy. Football next to poetry. Code next to religion. No aspect is a sidebar.
8. **Typography discipline.** Display for impact, body for reading, mono for machines, Nastaliq for Urdu.
9. **The golden spiral is visible.** As a construction line, a progress indicator, a navigation element — the spiral should be present in some form at all times, like the frame of a house showing through the walls.
10. **Construction line precision.** Every gap/padding/margin is a multiple of `--u` (8px). The underlying grid is real.
11. **Motion respects the reader.** `prefers-reduced-motion`, `document.hidden`, custom easing.
12. **Mobile-first degradation.** The fibonacci zoom → section-snap on mobile. Panels → single column with proportional heights. The spiral → progress sidebar.
13. **Zero console errors.** Every route, every viewport.
14. **Delusional optimism as design ethos.** Choose the beautiful option over the safe one. If it seems too ambitious, that's the right one.

---

## Part 11: The critique loop

Three passes per surface:

1. Screenshot at 1440×900 and 390×844 (desktop + mobile)
2. Critique like a hostile art director. Ask:
   - Does this feel like a 22-year-old who reads Berserk, writes ghazals, photographs overgrown London railway tracks, cheers for Barça, and builds Next.js apps? Or does it feel like an AI made it?
   - Is the golden ratio visible as structure, or did it collapse to a standard grid?
   - Is there enough negative space? Is the ember accent surgical?
   - Does the Urdu feel natural or tokenistic?
   - Could a fragment, a ghazal, a CS project writeup, and a football reaction all live in this feed without any of them feeling out of place?
   - Is the construction line layer present but not overpowering?
3. Fix everything found. Then add one deliberate human detail: a micro-interaction, a hidden hover state, a construction-line easter egg, a well-placed verse.

Console errors must be `[]` in every screenshot.

---

## Part 12: Prompt for Claude Code (copy-paste ready)

```
I'm rebuilding my portfolio from scratch. The repo is at the current directory —
Next.js/TypeScript/Tailwind/Velite/Framer Motion already set up.

Read VISION.md first. It's the complete design constitution. Every decision flows from it.

SUMMARY OF WHAT YOU'RE BUILDING:

A dark-first (warm near-black #0C0A08), golden-ratio-structured personal universe.
Not a portfolio — a home for code, poetry (Urdu + English), philosophy, manga reactions,
football fragments, religious conclusions, comedy, and everything else.

The golden ratio defines the site's architecture:
- Homepage: visible fibonacci grid with content in each golden rectangle
- Feed: panels sized by fibonacci proportions (8/5/3/2/1 units)
- The golden spiral drawn as a thin SVG construction line throughout

New content type: "fragments" — micro-posts (image + thought, quote + reaction,
link + comment) that live alongside full posts in the feed.

Bilingual: Urdu Nastaliq script is a structural element, not decoration.
Load Noto Nastaliq Urdu for Urdu text with proper RTL and lang attributes.

BUILD ORDER:
1. globals.css — complete token system (palette, typography, spacing, motion)
2. The golden ratio grid/homepage — the fibonacci rectangle layout with
   SVG spiral overlay. Start with Option C (Golden Grid) from VISION.md,
   then upgrade to Option A (Fibonacci Zoom) if time allows.
3. The feed panel grid — asymmetric panels sized by fibonacci ratios,
   different shapes per content type (wide for projects, tall for poetry,
   small for fragments)
4. Command palette (⌘K) — search/filter all content, keyboard navigable
5. Poetry layout — centered verse, bilingual Nastaliq support, maximum negative space
6. Project layout — dense dossier, stack chips, narrative body
7. Other layouts: essay, journal, adventure, fragment
8. Static pages: About, Now, Archive, Colophon, 404
9. Minimal header (site name + command palette trigger only)
10. Construction line SVG overlay + cursor element

EXISTING CONTENT: Keep the 5 MDX posts in content/posts/. Add 3-4 sample
fragments in content/fragments/ to test the fragment system.

Adapt velite.config.ts and lib/posts.ts for the new content model
(6 types including fragments, lang field, media/link fields).

CRITIQUE AS YOU BUILD: After each major component, screenshot and ask —
does this feel like a 22-year-old's universe, or an AI default?
```
