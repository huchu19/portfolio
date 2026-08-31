# DECISIONS.md — judgment calls made while you slept

> Current precedence: `ART-DIRECTION-2026.md`. Entries below record earlier
> iterations and are not instructions to restore indigo, marigold, visible
> Fibonacci geometry, or the line-art desk.

## 2026 studio art-direction reset

- The earlier aesthetic was coherent but read as a design system demonstrating
  a concept rather than a place inhabited by a person.
- Warm daylight is now the default; night mode changes the light inside the same
  room. Color comes from plaster, wood, paper, ceramics, books, plants, and
  project objects.
- The miniature studio is the hero, the character is rebuilt as a bespoke 3D
  figurine, and the old 2D wall becomes the accessible fallback rather than the
  primary visual identity.
- Golden-ratio geometry remains in proportions and placement but is no longer
  visibly drawn across the interface.
- Real content, semantic navigation, GitHub data, the Watcher, reduced motion,
  and the conventional archive are retained.

Each decision was made to be maximally consistent with VISION.md Part 10
(the non-negotiable rules). Revisit any of them freely.

## Structure & navigation

- **Option C (Golden Grid) built as the primary homepage**, per the build
  order. The grid is a real 13×8 fibonacci rectangle (`repeat(13)` ×
  `repeat(8)` tracks, `aspect-ratio: 13/8`) subdivided exactly as the
  spiral overlay draws it: intro 8², feed 5², featured 3², now 2², quick
  links 2×1. Option A (Fibonacci Zoom) status is logged at the bottom.
- **Feed lives inside the homepage** (the 5² rectangle, internally
  scrollable on desktop) rather than at a separate `/feed` route. VISION
  allowed either; one surface keeps the grid honest. Filters sync to
  `?type=` and `?tag=` on `/`.
- **Fragment permalinks live at `/fragments/[slug]`**, posts stay at
  `/writing/[slug]`. Fragment slugs derive from the filename with the
  `YYYY-MM-DD-` prefix stripped, so frontmatter stays 3–5 lines.

## Content model

- Fragments are a **separate Velite collection** (`content/fragments/`)
  merged with posts in `lib/posts.ts` (`getFeed()`), instead of one
  mixed collection — keeps fragment frontmatter frictionless (no
  required title/excerpt/slug).
- Added optional **`stack` and `status`** fields to project posts (VISION
  Part 5's dossier header needs chips and a Live/In Progress/Archived
  badge; the old schema had nowhere to put them).
- `excerpt` for fragments is **auto-extracted from the body** by Velite,
  so feed panels and search need no extra frontmatter.

## Type & bilingual

- **Nastaliq sits in every font stack** (display/body/mono) ahead of the
  system fallback, so stray Urdu inside otherwise-English text can never
  render in a Latin-script or system Arabic face (hard rule #4). Block
  Urdu still goes through the `<Urdu>` wrapper (`lang="ur"`, `dir="rtl"`,
  right-aligned).
- **Noto Nastaliq Urdu loads with `preload: false`** — the browser only
  fetches it when Urdu actually renders; that's the "on-demand" loading
  VISION asks for within next/font's constraints.
- Geist Mono chosen over IBM Plex Mono (first-listed option in VISION).

## Palette & texture

- The fragment type dot is **moss green (#6b8c5a)** and football tag dots
  a deeper green — VISION named "green for football" without a hex; chose
  a desaturated green that sits quietly on the void.
- The image fragment's media is a **placeholder SVG**
  (`public/media/nastaliq-over-mountains.svg`) standing in for the real
  wallpaper photo — swap it when you have the actual image.

## Removed / deferred

- **OpenGraph image generation deleted** with the old paper palette
  (`lib/og.ts`, `opengraph-image.tsx`). TODO: rebuild OG cards on the
  void/ember palette. Metadata (title/description) still ships.
- **Old components and BRIEFS.md / personal-site-brief.md deleted** per
  VISION Part 1 ("delete everything else").
- `site.url` remains a placeholder domain — set before going live.
- The Now page's GitHub telemetry (salvaged `lib/github.ts`) shows real
  public events for `huchu19`; currently reports 0 commits this week,
  which is honest but worth knowing about.

## Copy

- About, Now data, Colophon, 404, and the About-page Urdu paragraph are
  **first-person draft copy** marked with `draft: rewrite me` comments
  (JSX comments in pages, italic notes in MDX). The four sample fragments
  are written in-voice per VISION Part 3's examples (one image-reaction,
  one Iqbal quote, one football take, one link+thought).
- 404 quote is a **rewritten paraphrase** of the Berserk line, per
  VISION's own note to avoid quoting it directly.

## Option A status — shipped, navigation-flavored

- Implemented as **zoom navigation** (`components/golden/ZoomStage.tsx`)
  rather than scroll-hijacked zooming: chips at the grid's bottom-left
  (φ 13×8 · 8² · 5² · 3² · 2²) and keys 1–4 travel the viewport into
  that fibonacci rectangle with a 700ms zoom-pan on the site easing;
  Esc/0 pulls back to the full construction. The zoom math derives the
  transform from the same 13×8 unit space as the grid and spiral.
- **Why not scroll-driven:** scroll-hijacking the homepage would have
  fought the internally-scrollable feed cell, risked reduced-motion and
  mobile regressions, and made content unreadable mid-transition. The
  destination-based zoom delivers "travel the spiral" while Option C
  remains the resting state — nothing moves unless asked.
- Mobile and `prefers-reduced-motion` render Option C untouched (the
  controller renders no chips and applies identity transform).
- The full scroll-driven Fibonacci Zoom (viewport zooms as you scroll,
  VISION Part 2 Option A verbatim) remains a **documented TODO** if the
  destination-zoom ever feels insufficient.

## Light mode + pseudo-scroll traversal

- Added **light mode as a secondary skin**, matching VISION Part 4:
  dark remains the default identity, while the header toggle persists a
  deliberate light choice in `localStorage`. The implementation overrides
  the same color tokens (`--color-void`, `--color-bone`, etc.) instead of
  branching component styles.
- Upgraded Option A to **pseudo-scroll traversal**: wheel, touch swipes,
  Arrow/Page keys, and Space advance through the fibonacci zoom stops
  (`13×8 → 8² → 5² → 3² → 2²`). Internal feed scrolling still wins when
  the feed panel has room to scroll, so traversal does not trap long
  content.

## Option A verbatim — scroll-driven zoom (fable-25 pass)

- The homepage now ships **VISION Part 2 Option A as written**: a tall
  scroll track (~460vh) with a sticky stage; one smoothed spring on
  `scrollYProgress` interpolates the zoom-pan continuously through the
  stops (`13×8 → 8² → 5² → 3² → 2²`). Scale interpolates in **log
  space** so travel speed feels constant; the transform writes to a
  MotionValue, so nothing re-renders per frame.
- **The old objection dissolved, not overruled:** the pseudo-scroll
  version hijacked wheel/touch and hand-rolled `canScrollWithin()` to
  protect the feed. Native scroll + sticky needs none of that — the
  feed's internal scroll chains into the document scroll like any
  nested scroll area, so the hijacking code (wheel thresholds, touch
  deltas, travel cooldown) was deleted rather than ported.
- Chips and keys 1–4 became **scroll anchors** (they scroll the page to
  the stop's offset); Esc/0 scrolls back to the top. Arrows, Space, and
  Page keys work natively now. The chip row doubles as the progress
  indicator (nearest stop lights ember).
- Mobile and `prefers-reduced-motion` are unchanged: track height goes
  `auto`, no sticky, no transform — Option C exactly as before.

## The desk scene (see DESK-SCENE.md)

Judgment calls made building the literal desk — an illustrated avatar at a
standing desk, projects floating on the wall behind them, replacing the old
list-based Feed as the homepage's primary navigation.

- **`DeskBand` folded into the new screen, not kept separate.** Two "desk"
  metaphors on one page — one literal, one typographic — would have been
  confusing, and `Masthead.tsx`'s own comment ("the ghazal keeps its
  screen — everything below it is the desk") was already asking for this.
  `DeskBand.tsx` is deleted; its Building/Shipping/Elsewhere content lives
  on in `DeskScreen.tsx`, reused both inside the scene's monitor and as the
  compact card atop the mobile/reduced-motion fallback.
- **Fragments stay off the wall.** 8 posts float; the 4 fragments stay in
  `FragmentStrip` below. Twelve scattered objects read as clutter in early
  passes; revisit if the fragment count grows enough to matter.
- **Wall objects are real HTML `<Link>`s layered over decorative SVG, never
  SVG-native anchors.** SVG anchors have inconsistent focus-ring and
  hit-target behavior across browsers; this was non-negotiable once the
  scene became primary navigation rather than decoration.
- **Hover/focus opens the preview; click/Enter (which always follows hover
  or focus for mouse and keyboard alike) commits to the writeup.** The
  brief called for "click opens preview, click again navigates," but since
  hover/focus precedes every realistic click or Enter press, the preview
  is already open by the time either fires — so activating an
  already-open trigger navigates for real, and the `!isOpen` branch that
  would open it first is a defensive fallback for the rare activation
  that isn't preceded by focus, not the common path.
- **The wall's placement algorithm reuses `lib/generative.ts`'s seeded RNG
  and `lib/golden.ts`'s fibonacci weighting** rather than inventing a new
  system — seeded by each post's slug, so adding or removing a post never
  reshuffles anyone else's spot.
- **Mobile and reduced-motion share one fallback component** (`WallGrid`),
  which is also what a no-JS visitor sees, since wall-object positions are
  server-rendered inline styles with no mount animation gating their
  visibility.
- **Found and fixed a pre-existing bug in `Section.tsx`** while verifying
  the reduced-motion fallback: `initial={reduced ? false : {...}}` only
  governs the very first mount, so a visitor whose reduced-motion
  preference resolves *after* that first render (the hook starts `false`
  by design, to keep server and client in agreement) got permanently
  stuck at `opacity: 0` — the section that had already mounted was never
  told to become visible again. Fixed by always setting `initial` and
  driving the resting state through `animate` when reduced, since unlike
  `initial`, framer keeps `animate` live across re-renders. This affects
  every `Section`-wrapped homepage block, not just the desk scene.
- **Real 3D (React Three Fiber) is deliberately deferred**, not designed
  against — see `DESK-SCENE.md`'s "Future phase" note. `REVAMP.md`'s
  "do not build" list is updated to permit this scene's 2D layered motion
  and to stop citing the now-deleted `Parallax.tsx` as its ceiling.

## One illustrated world

- **The 3D studio is removed rather than restyled.** Its miniature lighting,
  modelled depth, and literal character made the garden below feel like a
  different site. The opening now uses the garden's own flat silhouettes,
  simple color fields, and short cut-paper shadows.
- **Human presence is implied, not depicted.** The active monitor, open
  notebook, mug, books, pinned work, and plant make the room feel occupied
  without asking a character to carry the identity.
- **The window is the visual handoff.** It contains the same tree, cloud, and
  path vocabulary used by the threshold, making the later garden feel like a
  place already visible from the first frame.
- **There is one renderer on every device.** Removing React Three Fiber,
  Three.js, and the WebGL/fallback controller makes the art direction stable
  across desktop, mobile, themes, reduced motion, and graphics capabilities.
