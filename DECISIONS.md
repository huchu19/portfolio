# DECISIONS.md — judgment calls made while you slept

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

## Option A status

- **Attempted after the full Option C build + critique pass** — see
  BUILDLOG.md for the outcome and the revert policy (revert to last good
  commit if messy, keep Option C as reduced-motion/mobile fallback).
