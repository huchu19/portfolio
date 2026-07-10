# BRIEFS.md — the design constitution for hussain-field-notes

This file is the non-negotiable build standard plus an art-directed brief per surface.
Every builder receives this whole file plus its own brief. Deviations from the standard
are bugs. Deviations from a brief require a reason written into the PR/commit message.

---

## The build standard (non-negotiable)

1. **Real copy only.** Placeholder text is clearly marked (an italic "*draft — rewrite me*"
   note) but written well, in a plausible personal voice. Never lorem ipsum, never
   "Your text here."
2. **The metaphor is printed matter come alive.** Warm paper, ink, hairline rules,
   numbered entries, stamps, margin notes. If an element wouldn't make sense in a
   beautifully printed personal journal, question it.
3. **Tokens only.** All colors, fonts, spacing come from `app/globals.css` `@theme`.
   Every gap/pad/margin is a multiple of `--u` (8px). No raw hex, no eyeballed pixels.
4. **One accent, ~5 uses per screen.** The terracotta is a scalpel, not a spill.
   At 10% coverage it reads editorial; at 50% it reads broken.
5. **Type roles.** Fraunces speaks (display, poetry, pull quotes, entry numbers in
   italic). Space Grotesk reads (body, UI). IBM Plex Mono reports (dates, tags,
   reading time, code, route strips) — always with tabular figures for columns.
6. **66ch measure** for reading columns; vertical rhythm in multiples of the body
   line-height.
7. **Custom easing on every transition**: `var(--ease)` = `cubic-bezier(.22,1,.36,1)`.
   Default/linear easings are forbidden.
8. **Motion honors the reader.** Everything respects `prefers-reduced-motion` (content
   fully readable with it on), rAF loops pause on `document.hidden`, nothing animates
   in a background tab. Semantic HTML underneath every trick.
9. **Accessible.** Landmarks, heading order, focus-visible states, alt text, AA contrast
   for text (use `--accent-deep` for accent-colored text on paper; the brighter accent
   is for graphic marks and large display only).
10. **Zero console errors** on every route, desktop and mobile.
11. **Discipline under the chaos.** Asymmetry is designed on a real grid, not accidental.
    Loud within the lines.

## Shared tokens (defined once in `app/globals.css`)

- Paper: `--paper` #F4EFE6 (bone) · `--paper-deep` #EDE4D2 (journal/notebook tint) ·
  `--line` #D9CFBE (hairlines)
- Ink: `--ink` #201B14 (warm near-black) · `--ink-soft` #5C5344 · `--ink-faint` #8D8271
- Accent: `--accent` #BC4A18 (terracotta — graphic marks, large display) ·
  `--accent-deep` #8F3610 (accent text at body sizes, AA on paper)
- Fonts: `--font-display` Fraunces variable (opsz + SOFT/WONK) · `--font-sans`
  Space Grotesk · `--font-mono` IBM Plex Mono
- `--u`: 8px · `--ease`: cubic-bezier(.22,1,.36,1)
- Global layers: fixed SVG feTurbulence film grain at ~4% opacity + soft vignette;
  `::selection` in accent.

## The critique loop (mandatory, three passes per surface)

One pass = run `node tools/shot.mjs <url> <out.png> <WxH> [scrollY]` at 1440×900 and
390×844, top/mid/bottom → **look at the pixels** and critique like a hostile design
director (rhythm, alignment, contrast, widows, dead zones, mid-word breaks, text
drowning in artwork, anything that smells like "AI default") → fix everything found →
add **one deliberate complexity upgrade** (a texture, a micro-interaction, marginalia,
an easter egg). Console errors must be `[]` in every shot.

---

## Surface briefs

### Feed (`/`) — Builder A
- **Concept:** the front page of a personal broadsheet. A short human intro (2–3
  sentences, first person), then the stream. Hairline rules divide entries — never
  card boxes. Entries are numbered `№ 01…` in italic Fraunces, oldest = № 01.
- **Layout:** asymmetric broadsheet grid; each post type gets a visibly different
  entry treatment (poetry: centered whisper with a verse line; project: dense
  technical row with mono spec fragments + links; journal: deeper paper tint block
  with a date stamp; adventure: route chips `LHE → DXB → LHR`; essay: editorial
  headline + excerpt + reading time).
- **Signature technique:** kinetic site name — per-letter cursor proximity drives
  Fraunces `wght`/`SOFT` axes. Sticky filter pills (All/Projects/Essays/Poetry/
  Journal/Adventures) with gradient fade into the page; filtering animates via
  Framer Motion layout/AnimatePresence; `?type=` synced to the URL.
- **Must prove:** five post types can share one stream and still be instantly
  tellable apart at a glance.

### Essay layout — Builder B
- **Concept:** a print feature torn from a serious review (THE LAST KEEPERS).
- **Layout:** big Fraunces headline, 66ch justified-with-hyphens measure on desktop
  (ragged on mobile), real pull-quotes, **margin footnotes** in the outer gutter on
  wide screens / inline disclosure on mobile.
- **Must prove:** long-form reading on the web can feel like print without a
  single image.

### Project layout — Builder B
- **Concept:** a build dossier, written as a narrative "how I built X" note.
- **Layout:** dossier header — mono spec table (Stack / Role / Year / Status,
  tabular figures), live/repo links as stamped buttons, denser measure, strong
  code blocks on a deep panel.
- **Must prove:** a portfolio piece can read as a story and still scan as a spec.

### Adventure layout — Builder B
- **Concept:** a flight log / travelogue.
- **Layout:** route strip under the title as mono chips (`LHE → DXB → LHR`) with an
  SVG route line that draws itself on scroll; cover image support; mile-marker
  section numbering.
- **Must prove:** a travel post can carry motion without a single photo required.

### Poetry layout — Builder C
- **Concept:** a poem read in generous *ma* (negative space) — MURMUR × YAMANAKA.
- **Layout:** narrow centered verse, Fraunces at generous size/leading, no reading
  time, no tags, no clutter. Stanzas reveal on scroll.
- **Signature technique:** the lantern — letters rest slightly ghosted (~55% ink)
  and sharpen to full ink within the cursor's radius; span-per-letter, one rAF
  loop, paused when hidden; full ink under reduced-motion/touch.
- **Must prove:** restraint can be the most experimental layout in the set.

### Journal layout — Builder C
- **Concept:** a notebook page (VERDIGRIS BUREAU letterpress warmth).
- **Layout:** deeper paper tint (`--paper-deep`), the date rendered as a
  letterpress-debossed stamp via an SVG feOffset/feFlood filter, intimate measure,
  optional faint ruled lines.
- **Must prove:** a web page can feel handwritten-adjacent without a script font.

### About (`/about`) — Builder D
- **Concept:** the human behind it. First person, warm, zero resume smell.
- **Must prove:** a personal page can be typographically rich with no images.

### Now (`/now`) — Builder D
- **Concept:** HELIOS "dense but legible" — a personal telemetry board: currently
  building / reading / job-hunt status / location, mono-flavored instrument panel,
  "last updated" stamp.
- **Must prove:** data-dense and warm are compatible.

### Archive (`/archive`) — Builder D
- **Concept:** the printed index. Years as section heads with hairline rules,
  tabular mono dates, type glyph markers, every post ever.
- **Must prove:** a list can be a pleasure.

### Colophon (`/colophon`) — Builder D
- **Concept:** "every site documents itself." How this site is made: type, tokens,
  stack, the FABLE 25 lineage of the process.
- **Must prove:** self-description can be charming, not self-important.

### 404 (`not-found.tsx`) — Builder D
- **Concept:** THE DEAD LETTER OFFICE — "this page went to the dead letter office."
  Returned-envelope vignette, accent postal stamp, link back to the feed.
- **Must prove:** an error state can be a favorite page.
