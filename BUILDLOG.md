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

## Phase 8 — the fable-25 pass (eight features, one night)

**Built**, borrowing techniques from the FABLE 25 showcase:
- **Option A verbatim**: continuous scroll-driven fibonacci zoom on a
  sticky ~460vh track; one smoothed spring interpolates the camera in
  log-scale space through 8² → 5² → 3² → 2². All wheel/touch hijacking
  deleted — native scroll chaining protects the feed now. Chips became
  scroll anchors + progress indicator.
- **Seeded generative art** (`lib/generative.ts`): slug-hashed PRNG →
  golden-angle phyllotaxis, flow fields, garden stems. Powers per-post
  cover art (server SVG, token colors), the rebuilt OG cards
  (1200×630, void/ember, Instrument Serif — closes the DECISIONS
  TODO), and the generated wallpaper at `/generated/wallpaper.svg`
  (placeholder SVG deleted).
- **Adventure route arc**: reading progress draws ember along the
  wave-toned flight path; airports light as passed; sticky under the
  header on md+. (The Phase-3 dasharray bug class tried to return via
  vector-effect — caught in one screenshot pass.)
- **Reading garden**: seeded moss stalks grow in the left gutter with
  reading progress on essay/project/journal/adventure pages (≥1280px);
  one ember bloom opens at 100%. Poetry stays bare — the darkness IS
  the design.
- **Kinetic ghazal**: word-by-word Nastaliq reveal (whitespace splits
  only, no overflow masks), blur-settle on the site easing.
- **Recitation player**: lazy WebAudio graph, 21-bar ember visualizer,
  golden-split seek line. Ships dormant until real audio exists.
- **/guide**: the making-of page — critique-loop story with before/after
  shots, live stats from velite, curated decisions.
- **Terminal + eggs**: `>` in ⌘K opens a five-command terminal (help,
  whoami, spiral, garden, urdu); typing "khwab" anywhere summons six
  seconds of the dream state.

**Verified**: build all-static (OG images included, `force-static`);
screenshot matrix at 1440×900 + 390×844 with console `[]`; `--reduced`
and `--light` flags added to `tools/shot.mjs` so the reduced-motion and
light-mode contracts are screenshot-proven, not promised.

**Caught by the loop this phase:**
1. OG dot field crowded the title column — disc moved right of the
   golden line.
2. Route arc rendered repeating dashes — Chrome ignores `pathLength`
   under `vector-effect: non-scaling-stroke` (Phase 3's bug, new coat).
3. Hydration mismatch in the reduced-motion ghazal — the reduced branch
   rendered different DOM; fixed by keeping one structure and swapping
   variants only.
4. Framer's `useReducedMotion` reported false on post pages while
   `matchMedia` said reduce — replaced with our own
   `hooks/usePrefersReducedMotion` everywhere the contract matters.

## Remains for Hussain (content, not code)

- Rewrite everything marked `draft: rewrite me` (About Urdu paragraph
  especially — it should be yours, not mine). The four project posts
  now carry real facts but my phrasing — put your voice on them.
- The wallpaper is now generated (`/generated/wallpaper.svg`) — swap in
  the real photo whenever you like.
- Set the real domain in `lib/site.ts` — OG cards are rebuilt and will
  use it the moment it lands.
- Record the ghazals: drop an mp3 path in any poetry post or fragment
  `media:` field and the recitation player wakes up.
- Rewrite the /guide prose — it is about you, in my words.
- Keep planting fragments — the model is 3 lines of frontmatter away.

## The desk scene (see DESK-SCENE.md, DECISIONS.md)

**Built:** the homepage's list-based Feed replaced with a literal desk —
an abstract line-art avatar at a standing desk, back to the viewer, with
every project/note/journal post floating on the wall behind them as a
real, clickable object leading to its writeup.

- `lib/wall.ts`: deterministic wall-object placement, seeded per post slug,
  reusing the site's existing seeded-RNG and fibonacci primitives.
- `components/home/desk/`: `DeskScene` (server, computes layout),
  `WallScene` (client, owns the one open-preview state + Escape/click-away/
  focus-out close), `ScatteredWall` + `WallGrid` (the CSS-gated
  wide-viewport and fallback renderings), `WallBackdrop` and `DeskFigure`
  (decorative SVG, the latter with seated and standing pose variants that
  crossfade on a slow timer), `DeskScreen` (absorbs `DeskBand`'s
  Building/Shipping/Elsewhere telemetry, now timer- rather than
  scroll-driven), `WallObject` + `WallObjectPreview` (the interactive
  layer — real `<Link>`s, not SVG anchors).
- Deleted: `DeskBand.tsx`, `Feed.tsx`, `FeedPanel.tsx`, `EntryLedger.tsx`.
- `REVAMP.md`'s "do not build" list updated: permits this scene's 2D
  layered motion, stops citing the deleted `Parallax.tsx`, and defers real
  3D to a documented future phase.

**Caught by the loop this phase:**
1. `WallBackdrop`'s golden-subdivision echo passed a 16:9 box into
   `goldenSubdivision`, which only holds for a true golden rectangle —
   produced negative rect dimensions (visible console errors) once the
   cut sequence ran past what the mismatched aspect ratio could support.
   Fixed by computing the subdivision in its own golden-ratio viewBox and
   slicing it to fill the scene, the same technique `ConstructionLines`
   already uses.
2. The in-scene monitor's Building/Shipping/Elsewhere content overflowed
   its box at the scene's actual rendered size — not a sizing-chain bug
   (verified the percentage-height cascade resolves correctly end to end)
   but genuinely too much content for the space. Trimmed to one Building
   item and tightened the type scale.
3. `Section.tsx` left every homepage block permanently invisible under
   reduced motion — `initial={false}` doesn't survive past the first
   mount, and nothing was left to carry the section to `opacity: 1` once
   the reduced-motion preference resolved a render later. Fixed by
   driving the resting state through `animate` instead of leaning on
   `initial`/`whileInView` alone; written up in DECISIONS.md since it
   affects every `Section`, not just this one.

**Verified**: `npm run build` clean; `tools/shot.mjs` at 1440×900 and
390×844, default/`--reduced`/`--light`, console `[]` in every shot;
keyboard flow scripted end to end (Tab reaches every wall object, focus
reveals its preview, Enter navigates, Escape closes, Tab order runs
trigger → preview → next trigger); the seated/standing crossfade and its
`SCREEN_RECT` repositioning confirmed by measuring both poses' DOM
geometry directly, not just by eye.

## Phase 9 — the inhabited studio reset

**Built:** the former indigo line-art desk has become a warm, tactile
miniature room. The first frame is now a useful semantic DOM composition,
then capable desktop browsers progressively add the custom React Three
Fiber scene: a modelled room, wooden desk, monitor, lamp, plant, chair,
character, shelves, paper notes, and four project-specific objects. The
JobHunter pin stack, EduNexus knowledge graph, Bamboo plant, and TiflToys
train are deliberately different artefacts rather than repeated cards.

The homepage below the room continues the physical language with taped
project dossiers, a corkboard of paper fragments, and a personal letter.
About, Now, Archive, and project pages now read as documents, boards, and
drawers from the same room. Daylight is the default; night changes the
lighting in the same room instead of swapping to a different visual world.

**Progressive enhancement:** mobile, reduced-motion, and unavailable-WebGL
paths render a complete CSS diorama with the same copy and links. The 3D
canvas is decorative and dynamically loaded, uses capped DPR and modest
geometry, and stops rendering while the tab is hidden. Project navigation
remains ordinary keyboard-accessible links above the canvas.

The production dependency pass also moved Next to 16.3.1, clearing the
production `npm audit` report while retaining the same static route output.

**Source of truth:** `ART-DIRECTION-2026.md` supersedes the visual rules in
the earlier VISION, REVAMP, and DESK-SCENE documents; those remain as
labelled project history. DECISIONS records why the reset happened.

## Phase 10 — leave the room

**Built:** the hero now chooses exactly one renderer. WebGL-capable desktop
browsers get the miniature 3D studio; mobile, reduced-motion, unavailable, and
lost-context cases get the semantic CSS room. There is no hidden second desk
underneath the canvas. The figure now has a full cropped hairstyle and a white
kurta with Pakistan-green waistcoat and trousers.

The homepage scroll is spatial: studio doors open, the room recedes, and the
visitor enters a garden before reaching work, fragments, and the closing note.
Karachi and London appear as a two-city route with coordinates. Garden foliage,
steam, dust, cursor, breathing, plant, and camera motion keep the world alive at
different tempos, with static reduced-motion equivalents.

A site-wide interaction layer gives real controls press depth, ripples,
magnetic pointer response, locally synthesized click sounds, and vibration on
supporting devices. Visitors can turn sound and haptics off. The opt-in
turntable supports local files, direct audio sources, Spotify shares, and Apple
Music shares; it does not autoplay and does not upload local files.

## Phase 11 — one illustrated world

**Built:** the opening studio is now a single responsive 2D composition. The
3D canvas, modelled character, WebGL boundary, loading state, and separate CSS
fallback are gone. An empty desk of personal objects sits beneath a large open
window; the window previews the same trees, clouds, and path that take over in
the garden threshold.

The flat shapes, restrained offset shadows, cream/green/mustard palette, and
mobile crop now stay consistent from the first frame through the garden. Day
and night are palette shifts of the same illustration. The removed Three.js,
React Three Fiber, and Drei packages also reduce the runtime and dependency
surface.

**Verified:** `npm run build` passes; desktop day/night, mobile, the closed-door
threshold, and garden arrival were captured with zero browser console errors.

### Night garden

Dark mode now follows the visitor outside. The studio window, opening doorway,
and long garden share layered stars; the threshold also gains a softly glowing
moon. Trees, path, canopy, boards, and foliage use a dedicated moonlit palette
rather than a blanket brightness reduction. Reduced motion keeps the star
fields static.
