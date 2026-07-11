# BUILDLOG.md — the night's work

## Phase 1 — raze & foundation (commit `8ead042`)

**Built:**
- Deleted the entire paper/terracotta aesthetic: all old components, CSS,
  OG images, BRIEFS.md, personal-site-brief.md.
- `app/globals.css`: full token system from VISION Part 4 — void/ember/
  wave palette, type voices (`.display`, `.mono-label`, `.urdu`,
  `.prose`), 8px unit, `cubic-bezier(.22,1,.36,1)` everywhere, panel
  hover language, geometric cursor ring, reduced-motion guards,
  ember `::selection`.
- Fonts via next/font: Instrument Serif, Inter, Geist Mono, Noto
  Nastaliq Urdu (lazy).
- Content model: fragments collection + `lang`/`media`/`link` fields,
  4 sample fragments, `stack`/`status` for projects.
- `lib/golden.ts`: φ, fibonacci, golden-rectangle subdivision that emits
  both the squares and the spiral path SVG — one source of geometry for
  the grid, the overlay, and the construction-line layer.
- Golden Grid homepage (Option C), feed panel grid with per-type shapes
  (project 2×2, essay 2×1, poetry 1×2, journal 1×1, adventure route
  strip 2×1, fragment 1×1), filters synced to `?type=`/`?tag=`.
- All six layouts, static pages, header/footer, construction lines,
  cursor, mobile scroll-progress line.

## Phase 2 — command palette (commit `5fc6314` includes fix)

⌘K palette: grouped instant search over posts+fragments, quick links +
recent when empty, arrow/enter navigation, Framer Motion enter/exit,
reduced-motion aware.

## Phase 3 — screenshot critique, round 1 (commit `5fc6314`)

**Critiqued (1440×900 + 390×844, console errors `[]` everywhere):**
home, project, poetry, essay, journal, adventure, fragment, about, now,
archive, colophon, 404, palette-open, `?type=fragment` filter view.

**Found and fixed:**
1. *Spiral rendered as broken dashes.* Root cause:
   `vector-effect: non-scaling-stroke` makes the browser compute
   `stroke-dasharray` in screen px, so the "draw" animation's dash
   pattern chopped the path into 34px segments. Removed the vector
   effect from the spiral path (kept on the squares), sized the stroke
   in viewBox units, dash length = real path length ((π/2)·Σ radii ≈ 32).
2. *Home grid could blow out its fibonacci proportions* — tracks now
   `minmax(0, 1fr)` and the feed cell clips + scrolls internally
   (verified: feed scrollHeight 880 inside a 497px cell, grid stays
   1307×804 ≈ 13:8).
3. *Ghazal line drifted to the far right of the intro square* —
   constrained to a 520px block so the Urdu hugs the name.
4. *Palette input showed the global focus ring inside the dialog* —
   suppressed for `.palette-input` only.
5. *Iqbal fragment's Urdu was an inline span* (left-anchored) — now the
   block `<Urdu>` wrapper, right-aligned Nastaliq at display size.
6. Panels get `position: relative` so the spiral reads as structure
   *behind* content, not a line across it.

**Human details added:** the spiral draws itself ahead of you on load;
the deep 1×1 subdivision squares sit beside the quick links like a
signature; the header name turns into حسین نقوی on hover.

**Deliberately accepted:** filter labels wrap to two lines inside the 5²
feed cell at 1440px (fibonacci cell is only ~490px wide; a smaller font
would hurt more than the wrap); bidi ellipsis on truncated mixed
Urdu/English lines in archive/feed panels.

## Phase 4 — verification notes

- `npm run build`: clean, all 19 routes static/SSG.
- Every screenshot's console errors: `[]` (the 404 page logs the
  document's own HTTP 404 — inherent to visiting a missing URL).
- DOM diagnostics (`tools/diag.mjs`): grid aspect 1307×804, spiral
  dashoffset lands at 0, construction layer at 0.035 opacity.

## Phase 5 — Option A attempt (shipped)

Implemented the Fibonacci Zoom as **destination zoom navigation**: the
home grid is a stage; chips (φ 13×8 · 8² · 5² · 3² · 2²) and number keys
1–4 zoom-pan the viewport into each golden rectangle (700ms, site
easing), Esc pulls back out. Desktop-only; mobile and reduced-motion get
Option C untouched. Verified by screenshot at rest, zoomed into 8² and
5², and after Esc — console `[]` in all states, text stays sharp, the
internally-scrollable feed still works while zoomed. Full rationale in
DECISIONS.md.

Critique of the zoomed states found and fixed: the intro square is
full-height, so contain-fit produced no travel (scale ≈ 0.94) — stops now
support a hand-tuned scale (intro 1.3); and the chips originally sat
below the fold — moved inside the grid's empty bottom-left corner.

## Phase 6 — light mode + pseudo-scroll

**Built:**
- Light mode token overrides with a persisted header toggle. Dark remains
  the default; the saved preference is applied before hydration to avoid
  a flash of the wrong skin.
- Wheel, touch-swipe, Arrow/Page, and Space traversal through the
  Fibonacci zoom stops. The feed's internal scroll area is detected first,
  so scrolling the feed still behaves like a normal scrollable panel.

## Phase 7 — real GitHub work, with pictures

**Built:**
- Every real repo on github.com/huchu19 now has a project post with real
  `projectLinks` and a cover picture: TiflToys (placeholder
  `your-handle`/`example.com` links replaced), plus new posts for
  EduNexus (FYP), Bamboo, and JobHunter. Bodies are grounded in each
  repo's README and marked `draft-note` for voice.
- Pictures live in `public/media/projects/`: live-deployment screenshots
  (puppeteer via `tools/shot.mjs`, JPEG'd) for TiflToys, Bamboo, and
  EduNexus; JobHunter has no deployment, so its repo's own
  `opengraph-image.png` stands in.
- `ProjectLayout` now renders `coverImage` (same framed idiom as
  `AdventureLayout`). The featured cell self-updates — it picks the
  newest project post, currently JobHunter.
- Verified by build + screenshots of `/writing/edunexus-fyp`,
  `/writing/jobhunter-uk-sponsor-finder`, and the home grid — console
  `[]` everywhere.

## Remains for Hussain (content, not code)

- Rewrite everything marked `draft: rewrite me` (About Urdu paragraph
  especially — it should be yours, not mine). The four project posts
  now carry real facts but my phrasing — put your voice on them.
- Replace the placeholder wallpaper SVG with the real photo.
- Set the real domain in `lib/site.ts`; rebuild OG cards (see DECISIONS).
- Keep planting fragments — the model is 3 lines of frontmatter away.
