# DESK-SCENE.md — literalizing the desk

This document supersedes the homepage-navigation parts of `REVAMP.md` where the
two conflict, the same way `REVAMP.md` supersedes `VISION.md`. `REVAMP.md`'s
palette, typography, content model, GitHub wiring, and the Watcher all remain
in force unchanged — this document only concerns `/` and specifically what
replaces `Feed`/`EntryLedger`/`DeskBand`.

## The metaphor

`Masthead.tsx` already promised this: *"the ghazal keeps its screen — everything
below it is the desk."* Until now that was fulfilled only abstractly, via
`DeskBand`'s typographic Building/Shipping/Elsewhere panel. This document
literalizes it: an illustrated scene where the site owner's avatar sits or
stands at a standing desk, back to the viewer, facing a screen. Every project,
note, and journal entry floats on the wall behind them as a clickable object
leading to its writeup. This is now the **primary** way to browse the site's
writing — not a decorative hero bolted onto the existing list. The list still
exists, unchanged, at `/archive`.

## Component tree

```
app/page.tsx
├── Masthead
├── DeskScene              components/home/desk/DeskScene.tsx
│   └── WallScene           components/home/desk/WallScene.tsx
│       ├── WallGrid                  .../WallGrid.tsx        (reduced-motion / narrow viewport / no-JS fallback)
│       └── ScatteredWall             .../ScatteredWall.tsx    (wide + motion-ok)
│             ├── WallBackdrop        .../WallBackdrop.tsx
│             ├── DeskFigure          .../DeskFigure.tsx       (seated + standing variants)
│             ├── DeskScreen          .../DeskScreen.tsx       (absorbs former DeskBand)
│             └── WallObject × 8      .../WallObject.tsx       (+ WallObjectPreview)
├── FragmentStrip
└── Invitation
```

`lib/wall.ts` holds `computeWallLayout()`, the placement algorithm.

## Placement algorithm

Deterministic, seeded by each post's **slug** (not index or date), reusing
`lib/generative.ts`'s `seededRng` and `lib/golden.ts`'s `fibFractions` — no new
randomness system. A `cols × rows` grid (fibonacci-weighted column widths)
comfortably exceeds the post count; each post's RNG stream draws a cell from
the remaining pool, then jitters position/rotation/scale within it, inset so
overlap is impossible by construction. Output is percentages, not pixels, so
adding or removing a post never reshuffles anyone else's spot.

## Interaction contract

- Hover/focus on a `WallObject` opens an in-scene preview (title, glyph, date,
  excerpt) anchored near it — never a layout shift, only one open at a time.
- First click/Enter/Space on a not-yet-open trigger opens the preview instead
  of navigating (`preventDefault`). A second activation on the same trigger,
  or the preview's own "Read →" link, navigates normally.
- Close via Escape, click/tap outside, a visible ✕ (touch has no Escape), or
  focus leaving the scene entirely. Ordinary trigger → "Read →" tab traversal
  must never auto-close.
- Every `WallObject` is a real `<Link>`, not a `<button>` or an SVG-nested
  anchor — preserves middle-click/cmd-click and consistent focus rings.
- `WallObjectPreview` renders in the DOM immediately after its own trigger so
  Tab order is trigger → its preview → next trigger.
- `WallObject` positions are plain server-rendered inline styles — visible and
  clickable with zero JS. Framer Motion is reserved for the preview's
  open/close transition and the pose crossfade below; never for the wall
  object's base visibility.

## Pose alternation

The desk is a standing desk. `DeskFigure.tsx` draws two variants — seated and
standing — sharing one desk footprint so they read as the same desk raised or
lowered. A client wrapper crossfades between them roughly every third
screen-content cycle (~18–21s), animating the desk-front-edge/monitor position
alongside so the screen appears to rise and fall with the desk; `DeskScreen`
tracks the same interpolated position rather than jumping between two fixed
rects. Paused when the tab is hidden. Under reduced motion, one pose is chosen
deterministically (seeded by date, so it still varies visit-to-visit) and
rendered statically — no crossfade.

## Screen content

`DeskScreen.tsx` absorbs `DeskBand.tsx`'s Building/Shipping/Elsewhere content
wholesale, unchanged in substance. The one real behavior change: state advance
is timer-driven (~6–7s, pausing on hover/focus/hidden-tab) rather than
scroll-driven, since the scene has no dedicated scroll track to hang it on —
matching `GhazalLine`'s existing timer idiom elsewhere on the page.

## Responsive strategy

Both `WallGrid` and `ScatteredWall` render unconditionally; Tailwind
responsive classes (not a JS `matchMedia` toggle) switch which is visible, so
there's no pre-hydration flash of the wrong layout. `WallGrid` — a plain
server component, direct single-tap links, excerpt shown inline, no two-step
preview — is simultaneously the reduced-motion fallback, the narrow-viewport
layout, and the no-JS baseline.

## What's deliberately excluded from the wall

Fragments (the 4 micro-content pieces) stay in `FragmentStrip`, not on the
wall — 12 floating objects was judged too cluttered against 8. This is a
recorded call, not an oversight; revisit if the fragment count grows
meaningfully.

## Future phase: real 3D

A React Three Fiber version of this scene — actual camera depth, a desk you
can orbit slightly, objects with real thickness — is a deliberate future
direction, not part of this build. It's flagged here so the intent survives
between now and whenever it's picked up, but nothing about the 2D
implementation should be designed to anticipate it; build the 2D version on
its own terms.
