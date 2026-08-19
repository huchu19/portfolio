# REVAMP.md — direction change for `hussain-field-notes`

This document supersedes `BRIEFS.md` where the two conflict. Work through the phases
in order. Do not skip ahead: the palette and type system must land before any new
feature is built, otherwise the new features get tuned against a look that is about
to be thrown away.

The existing codebase is not the problem. The **specification** was the problem —
`BRIEFS.md` mandated a "printed matter" metaphor and near-total restraint, and the
code executed that faithfully. The result is beautiful and inert. This document
changes the spec.

---

## Phase 0 — Delete the old constitution

Before writing any code, edit `BRIEFS.md` and remove these rules outright. They are
the direct cause of the problem being fixed:

- Rule 2 — *"The metaphor is printed matter come alive… If an element wouldn't make
  sense in a beautifully printed personal journal, question it."*
- Rule 4 — *"One accent, ~5 uses per screen. The terracotta is a scalpel, not a spill."*
- The entire **Poetry layout — Builder C** brief (MURMUR × YAMANAKA, *ma*, the lantern),
  including *"restraint can be the most experimental layout in the set."*
- The **Adventure layout** and **Essay layout** briefs (both are being merged — see Phase 2).
- The Shared tokens block (replaced wholesale in Phase 1).

Keep and continue to honour rules 1, 3, 5–11 (real copy only, tokens only, type roles,
66ch measure, custom easing, reduced-motion, accessibility, zero console errors,
discipline under the chaos). Keep the three-pass critique loop with `tools/shot.mjs`.

**The new metaphor:** *the desk, mid-work, while someone is standing at it.* Not a
finished printed artefact — a workspace in use. This permits status lines, things
pinned at angles, crossings-out, counters, a site that reacts because a person is
present. Where the old brief asked "would this appear in a printed journal?", the
new question is **"does this feel like someone is here right now?"**

---

## Phase 1 — Palette and typography

This is the highest-leverage change in the document. Everything else depends on it.

### 1.1 Tokens

Replace the `@theme` block at the top of `app/globals.css` entirely. **Dark is now the
default**, not a toggle state.

```css
@theme {
  /* ground */
  --color-bg:      #0b0e1f;  /* page — deep indigo, never pure black */
  --color-surface: #131834;  /* raised blocks, journal entries */
  --color-raised:  #1d2447;  /* code panels, cards that need to sit up */
  --color-line:    #2e3763;  /* hairlines, borders */

  /* figure */
  --color-fg:       #f2ede3; /* bone — body text */
  --color-fg-soft:  #a8afc9; /* secondary text */
  --color-fg-faint: #6f779a; /* metadata, stamps, timestamps */

  /* accents */
  --color-accent:      #ffb020; /* marigold — the site's own voice */
  --color-accent-deep: #c77e00; /* marigold on light surfaces only */
  --color-signal:      #2ee6c0; /* teal — the Watcher's voice, and only the Watcher's */

  /* type */
  --font-display: var(--font-bricolage), "Helvetica Neue", system-ui, sans-serif;
  --font-sans:    var(--font-grotesk), "Avenir Next", system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains), ui-monospace, "SF Mono", monospace;

  /* motion */
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

**Two-accent discipline — this replaces old rule 4.** Marigold is the site speaking
about itself: nav, links, entry numbers, status, hover states. Use it freely, roughly
10–20 marks per screen. Teal is reserved *exclusively* for the Watcher (Phase 4) and
for genuinely live data (last push time, currently-building status). A reader should
be able to learn, without being told, that teal means "this is happening now."
Never use teal for decoration.

Contrast: bone on indigo ≈ 15:1, marigold on indigo ≈ 9:1, teal on indigo ≈ 11:1.
All pass AA at body size, so the `--accent-deep`-for-body-text workaround the old
brief needed is no longer required. `--color-accent-deep` survives only for the
optional light theme.

Rename every usage across the codebase: `paper` → `bg`, `paper-deep` → `surface`,
`panel` → `raised`, `ink` → `fg`, `ink-soft` → `fg-soft`, `ink-faint` → `fg-faint`.
Grep for `paper`, `ink`, and `terracotta` and leave none behind, including in
component filenames and comments.

### 1.2 Theme direction inverts

`ThemeToggle.tsx` currently defaults to day and toggles to `dusk`. Flip it: **indigo
is the default with no data attribute**, and the toggle adds `data-theme="daylight"`
for an optional light mode. Update the pre-paint script in `app/layout.tsx` and the
`fn-theme` localStorage values to match (`'daylight'` / `'default'`). Build the light
theme second and treat it as secondary — it must not be the design driver.

### 1.3 Grain and vignette

The `body::before` film grain is currently `opacity: 0.05`. On a dark ground that
reads as sensor noise and causes visible banding on gradients. Drop it to `0.025`
and add `mix-blend-mode: overlay`. Change the `body::after` vignette to lighten
rather than darken — `radial-gradient(130% 100% at 50% 0%, rgb(255 176 32 / 0.04),
transparent 55%)` — so the top of the page reads as lamplight falling on the desk.

### 1.4 Fonts

Fraunces is soft, warm and wonky, and it is half the reason the site reads gentle.
In `app/layout.tsx`:

- **Remove** `Fraunces` and `IBM_Plex_Mono`.
- **Add** `Bricolage_Grotesque` as `--font-bricolage`, with `axes: ['opsz', 'wdth']`.
- **Add** `JetBrains_Mono` as `--font-jetbrains`, weights `['400', '500', '700']`.
- **Keep** `Space_Grotesk` exactly as is.

Bricolage is variable on `wght`, `wdth` and `opsz`, so `KineticTitle.tsx` ports over
almost unchanged — swap the Fraunces `wght`/`SOFT` axis interpolation for
`wght`/`wdth`. Cursor proximity should now *widen and embolden* letters rather than
softening them. Push the range harder than the current values; the effect should be
obvious at a glance, not subtle.

Revised type roles (replaces rule 5): **Bricolage announces** (display, headlines,
entry numbers, pull quotes — set tight, `letter-spacing: -0.02em`, and large).
**Space Grotesk reads** (body, UI). **JetBrains Mono reports** (dates, tags, status,
code, the Watcher, reading time) — always with `font-variant-numeric: tabular-nums`.

### 1.5 Acceptance

Run the three-pass critique loop from `BRIEFS.md` on `/` at 1440×900 and 390×844.
The site must be unrecognisable next to a screenshot of the current build, with zero
console errors and no remaining cream, terracotta, or serif display type anywhere.

---

## Phase 2 — Collapse the content model, remove poetry

Five post types with five bespoke layouts is why the feed reads as five costumes
rather than one voice. Go to three.

### 2.1 New type system

| New type  | Absorbs                    | Glyph | Layout                                             |
| --------- | -------------------------- | ----- | -------------------------------------------------- |
| `project` | project                    | `⌗`   | dossier — spec table, live GitHub data, repo links |
| `note`    | essay, poetry, adventure   | `§`   | reading layout — 66ch, pull quotes, footnotes      |
| `journal` | journal                    | `¶`   | intimate — `--color-surface` block, date stamp     |

A ghazal is now a `note` tagged `poetry`. It gets the standard reading layout. Poetry
is no longer a first-class concept anywhere in the design.

### 2.2 Delete

- `components/LanternPoem.tsx`
- `components/PoemStanza.tsx`
- `components/layouts/PoetryLayout.tsx` and `PoetryLayout.module.css`
- `components/layouts/AdventureLayout.tsx` and `AdventureLayout.module.css`
- The `poetryFirstLines()` function and its `fs`/`path` imports at the top of
  `app/page.tsx` — it exists solely to lift verse lines into the feed.
- The `verses` prop threaded through `app/page.tsx` → `Feed.tsx` → `PostCard.tsx`,
  and the verse-rendering branch inside `PostCard`.

### 2.3 Rework

- `components/layouts/EssayLayout.tsx` → rename to `NoteLayout.tsx`. Keep the 66ch
  measure, real pull quotes and margin footnotes (`Footnote.tsx` stays — it is good).
  Drop the justified-with-hyphens setting; justification was part of the print
  metaphor and reads stiff on dark.
- `components/RouteStrip.tsx` — **keep**, but demote it from an Adventure-layout
  fixture to an MDX component available inside any `note`. Travel posts still get
  their `LHE → DXB → LHR` chips and the self-drawing SVG route line; they just no
  longer need a whole post type. Register it in `MDXContent.tsx`.
- `components/DebossStamp.tsx` — the letterpress deboss (`feOffset`/`feFlood`) is a
  paper effect and will not read on indigo. Rebuild it as an engraved plate: 1px
  marigold inner stroke, `--color-raised` fill, mono tabular date. Same component
  name and API.
- `components/PostLayout.tsx` — reduce the variant switch from five branches to three.
- `components/InkHero.tsx`, `InkGhost.tsx`, `InkReveal.tsx`, `QuoteStamp.tsx`,
  `Restamp.tsx` — retune against the new tokens and rename `Ink*` → `Mark*`. Check
  each one still earns its place; delete any that were only interesting on paper.

### 2.4 Schema and config

- `velite.config.ts` — change the enum to `['project', 'note', 'journal']`. Add an
  optional `repo: s.string().optional()` field (format `"huchu19/tifltoys"`) for
  Phase 3. Keep `route`, now valid on any `note`.
- `lib/posts.ts` — update `POST_TYPES` to the three-entry map above; delete the ❦ and
  ⁂ glyphs. Update `POST_TYPE_ORDER`.
- `components/FilterBar.tsx` — four pills now: All / Projects / Notes / Journal.
  Keep the `?type=` URL sync and the Framer Motion filter animation.
- Migrate the five files in `content/posts/`: retype `2026-05-on-leaving-comfort` and
  `2026-03-lahore-to-london` and `2026-04-what-i-learned-building-edunexus` to `note`
  (the first tagged `poetry`, the second tagged `travel` and keeping its `route`).
  Leave `2026-06-tifltoys-headless-build` as `project` and `2026-07-a-tuesday-in-july`
  as `journal`.

### 2.5 Acceptance

`npm run build` passes with zero type errors. The feed renders three visibly distinct
entry treatments that still read as one publication. No file in the repo contains the
string `poetry` except as a tag value in one MDX file.

---

## Phase 3 — Ship it, and wire GitHub properly

### 3.1 Go live (do this before Phase 4)

- `lib/site.ts` — replace `url: 'https://field-notes.example'` with the real domain.
  Nothing that reads it (RSS, sitemap, OG images) works until this is set.
- `content/posts/2026-06-tifltoys-headless-build.mdx` — `projectLinks` currently point
  at `https://example.com/tifltoys` and `github.com/your-handle/tifltoys`. Fix both.
- Deploy to Vercel. Add `GITHUB_TOKEN` as an env var (raises the API ceiling from
  60 to 5,000 requests/hour).

### 3.2 Extend `lib/github.ts`

The existing `getShipping()` reads `/users/{user}/events/public` with hourly
revalidation and degrades to `null` gracefully. Keep it exactly as it is and add
alongside it:

```ts
export type RepoFacts = {
  description: string | null
  stars: number
  language: string | null
  languages: Record<string, number>  // from /repos/{full}/languages
  pushedAt: string
  url: string
}

export async function getRepoFacts(fullName: string): Promise<RepoFacts | null>
```

Same shape of implementation: `next: { revalidate: 3600 }`, `Accept:
application/vnd.github+json`, `Authorization: Bearer ${process.env.GITHUB_TOKEN}`
when present, `try/catch` returning `null`. **Every surface that consumes this must
render correctly when it returns `null`** — the API failing must never blank a page.

Then:

- **Project dossiers** — `app/writing/[slug]/page.tsx` reads the new `repo`
  frontmatter field and passes live facts into `ProjectLayout`'s mono spec table:
  language breakdown as a thin stacked bar, stars, last-push date. The static
  Stack/Role/Year/Status rows stay; live rows are appended and marked in teal.
- **Masthead status line** — a single mono line under the site name, teal:
  `last pushed to tifltoys · 4h ago`. `getShipping()` already returns exactly this.
  This one line does more for aliveness than any animation on the site.
- **`/now`** — keep the existing telemetry board, retuned to the new palette.

### 3.3 Footer version

Add a mono version string to `components/Footer.tsx`: `v1.0.0 — the desk`. Bump it in
the same commit as any visible change and append a three-word note. Costs nothing,
and signals a site in constant motion.

---

## Phase 4 — The Watcher

The signature feature. The site notices how you are reading and eventually speaks to
you, earning familiarity rather than assuming it. This is the thing readers will
remember and tell other people about, so it deserves more care than anything else in
this document.

### 4.1 Architecture

`components/watcher/WatcherProvider.tsx` — a client context holding a signal bag,
mounted once in `app/layout.tsx`. Roughly 150 lines total; the rules live separately
in `lib/watcher/rules.ts` so that after the first hour the work is writing copy, not
code.

**Signals to collect:**

| Signal          | Source                                                      |
| --------------- | ----------------------------------------------------------- |
| `clicks`        | document-level listener, session-scoped                     |
| `idleSeconds`   | 1s interval, reset on any input; **pauses on `document.hidden`** |
| `scrollDepth`   | max % reached on the current route                          |
| `entriesRead`   | count of `/writing/*` routes where scrollDepth > 70%         |
| `visits`        | localStorage, incremented once per session                   |
| `dwellSeconds`  | total time on site this session                              |
| `filterChurn`   | ≥4 filter pills clicked within 5s                            |
| `hourOfDay`     | `new Date().getHours()` — late-night reading gets its own copy |
| `revisitedPost` | opening a slug already in the localStorage read-set          |
| `emailHover`    | hovering the footer email without clicking                   |

### 4.2 The escalation ladder

A rule may only fire when its tier is unlocked. This is what makes the system feel
like a person rather than a gimmick — the site does not open by being familiar with
a stranger.

1. **Observational** — notices, does not address you. Available immediately.
   Extends the ledger bookmark already in `Feed.tsx` (the `№ 04 / 12` marker riding
   the corner via `IntersectionObserver` at `rootMargin: '-42%'`).
2. **Familiar** — starts using "you". Unlocks at `entriesRead >= 2` or
   `dwellSeconds > 120`.
3. **Conspiratorial** — tells you things it would not tell a stranger. Which post he
   nearly deleted, what a project actually cost him. Unlocks at `visits >= 2`.
4. **Direct** — breaks the fourth wall and asks for something. Unlocks at
   `entriesRead >= 4` **and** `visits >= 2`.

Persist the tier in localStorage under `fn-watcher`, so a returning reader is greeted
at tier 2 — *"back again. the tea theory holds."* This is the part that beats the
reference site, which starts every visitor from zero.

### 4.3 Rule format

```ts
type Rule = {
  id: string
  tier: 1 | 2 | 3 | 4
  when: (s: Signals) => boolean
  say: string | ((s: Signals) => string)
  once?: boolean   // default true, deduped by id in localStorage
}
```

Starter set for `lib/watcher/rules.ts` — rewrite all of these in Hussain's own voice
before shipping; they are placeholders that establish register, not final copy:

- t1, `clicks === 1` — "One click. Noted."
- t1, `filterChurn` — "Alright, easy. Nothing here is load-bearing."
- t2, `idleSeconds >= 8` — "You've gone quiet. Reading, or gone to make tea?"
- t2, `idleSeconds >= 20` — "Definitely tea."
- t2, `hourOfDay >= 1 && hourOfDay <= 4` — "It's gone one in the morning. I'm flattered, but go to sleep."
- t3, `revisitedPost` — "Second time through this one. It's my favourite too."
- t3, `entriesRead >= 3` — "Three entries. That's more than my mother's managed."
- t4, `emailHover` — "Go on then."

### 4.4 Constraints — non-negotiable

- Rendered in `--color-signal` (teal), mono, as marginalia in the outer gutter on
  desktop and inline between entries on mobile. **Never a toast, never a modal,
  never a popup.** It is a note in the margin of a desk, not a notification.
- Throttle: one note per 20 seconds, maximum five per session, hard stop.
- `aria-hidden="true"`. The notes are decorative and non-essential; announcing them
  in a live region would hijack a screen reader mid-sentence. The site must be
  complete without them.
- Under `prefers-reduced-motion`, notes appear with no transition — still present,
  just static.
- The 1s interval must not run when `document.hidden` (existing rule 8).
- Zero layout shift when a note appears. Reserve the gutter.

### 4.5 Acceptance

A first-time visitor who reads one entry sees at most two tier-1 notes. A returning
visitor who reads three entries sees tier-3 copy. Clearing localStorage resets to
tier 1. No note ever appears twice.

---

## Phase 5 — Unedited mode

The site's own version of the reference site's tone toggle, and a better fit for
something that calls itself documentation of a headspace.

One switch in the header flips published prose to the draft underneath: strikethroughs,
margin doubts, the sentence that was cut. Implement as two MDX bodies per post —
`content/posts/{slug}.mdx` and an optional `content/posts/{slug}.unedited.mdx`,
picked up by a second Velite collection. Posts without an unedited variant show the
published text with a mono note: `no draft survives for this one`.

State lives in localStorage (`fn-unedited`) and applies site-wide, with the toggle
label switching between `edited` and `unedited`. Set in marigold, not teal — this is
the site talking about itself, not live data.

---

## Do not build

Explicitly out of scope. Adding these will undo the coherence the phases above buy:

- A page-transition library, cursor trails, 3D, scroll-jacking, parallax beyond what
  already exists in `Parallax.tsx`.
- A third accent colour.
- Any new post type.
- A CMS or database. MDX in the repo remains the content store.
- Substack. `app/feed.xml/route.ts` is already a working RSS feed; add a Buttondown
  form in the footer for email and keep all writing in one place.
- More Watcher rules than the ladder supports. Three interactions that feel like a
  person beat fifteen that feel like a template — that is the entire lesson of the
  reference site, which ships four pages.

---

## Order of work

1. Phase 0 — rewrite `BRIEFS.md` (one sitting, highest leverage in the document)
2. Phase 1 — tokens, theme inversion, fonts
3. Phase 2 — collapse types, delete poetry apparatus
4. Phase 3 — deploy, then GitHub wiring
5. Phase 4 — the Watcher
6. Phase 5 — unedited mode

Run the three-pass critique loop from `BRIEFS.md` at the end of every phase, at both
1440×900 and 390×844, top/mid/bottom. Console errors must be `[]` in every shot.
Commit at least once per phase — `/now` reads the public events feed, so a repo with
one commit makes the site visibly report that nothing is being shipped.
