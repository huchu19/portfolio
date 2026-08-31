# ART-DIRECTION-2026.md — The inhabited studio

> Current visual source of truth. This document supersedes the visual rules in
> `VISION.md`, `REVAMP.md`, and `DESK-SCENE.md` wherever they conflict. Those
> files remain as history and as documentation of useful systems.

## Thesis

Khwabon ka Bagh is a small, warm, lived-in developer studio: a physical
manifestation of Hussain's headspace. The person at the desk is the visual
identity. Projects, writing, fragments, live work, Urdu, and private obsessions
live as objects around him.

The quality benchmark is the feeling of authored, tactile environmental
storytelling found in Lucas Martinic's portfolio. We borrow principles—miniature
scale, depth, material, human presence, quiet motion, and biographical props—not
his room, character, assets, layout, or interactions.

The first reaction should be “I have entered this developer's little world.”
Within seconds the visitor must still know Hussain's name, role, recent work,
writing practice, and the conventional routes through the site.

The opening and garden now share one flat, cut-paper illustration language.
The room is defined by the evidence of a person—a warm monitor, open notebook,
books, mug, growing plant, and pinned work—rather than a literal character.

## What survives

- Next.js App Router, React, TypeScript, Velite/MDX, and the real content model.
- Project and GitHub metadata, `/now`, archive, RSS, sitemap, OG images, and
  semantic layouts.
- The monitor's Building / Shipping / Elsewhere states.
- Keyboard access, visible focus, reduced-motion and no-JS fallbacks,
  `document.hidden` discipline, and the zero-console-error standard.
- The Watcher, reframed as something the room says rather than a system overlay.
- Urdu as a first-class language, fragments as first-class content, and the
  concept “Khwabon ka Bagh — a universe, not a portfolio.”
- Golden-ratio thinking as an invisible compositional tool.

## What is superseded

- Dark indigo as the default identity; marigold and teal as the dominant signals.
- Visible Fibonacci grids, spirals, construction overlays, and mathematical UI.
- The standalone full-screen masthead and oversized typographic hierarchy.
- The line-art figure, flat wall, floating generative cards, and “technical
  panel” visual language.
- Monospace/uppercase as the default metadata voice, glassy sticky navigation,
  and repeated rounded cards.
- “Precision × rawness” when it makes the site feel like a design-system demo.

## Room composition

The homepage opens directly into a graphic, front-facing studio illustration.

- Foreground: timber desk edge, notebook, mug, books, and a few deliberately
  cropped objects.
- Midground: monitor, lamp, bamboo plant, and project-specific objects.
- Background: warm plaster, shelf, pinned project prints, Urdu paper, and a
  large window whose trees and path foreshadow the garden below.

The room is a composed 2D scene, not an illustration beside marketing copy.
Identity text sits in the same composition and yields visual authority to the
room. Depth comes from overlap and scale, never 3D lighting or perspective.

## Content-object language

- Projects are substantial designed objects: pinned photographs, folders,
  product boxes, or monitor windows. JobHunter suggests application cards;
  EduNexus a notebook/learning diagram; Bamboo a small plant/growth marker;
  TiflToys a compact toy/storefront object.
- Notes are papers, notebook pages, or prints.
- Journal entries are quieter dated pages.
- Fragments are small scraps, marginalia, tickets, or postcards.

Every navigable object has a visible DOM counterpart: a real link, accessible
name, keyboard focus, concise preview, and conventional archive fallback. No
invisible 3D hotspots carry essential navigation.

## Palette and materials

Day studio is the default:

- cream plaster `#eee4d2`
- parchment `#f8f1e5`
- walnut ink `#302923`
- warm timber `#8a5738`
- mustard `#d6a43b`
- terracotta `#c76345`
- dusty sage `#789078`
- chalk blue `#6f8fa7`
- muted red `#a94d3f`

Night studio is the same room after sunset: deep warm brown ground, preserved
object hues, cool window fill, a lit monitor, and a warm desk lamp. It is never a
token inversion or cyberpunk mode.

Materials are matte painted wood/plastic, plaster, cork, paper, ceramic, fabric,
cardboard, and restrained metal. Avoid glass, chrome, glossy black, neon,
holograms, and photoreal texture packs.

## Typography

Bricolage Grotesque remains for concise identity and headings; Inter remains the
quiet reading face; JetBrains Mono is limited to live/technical data. Noto
Nastaliq Urdu remains structural, correctly marked `lang="ur"` and `dir="rtl"`.

Typography no longer performs all of the personality. Labels use sentence case
by default. Large display type is rare. Urdu is placed meaningfully, including as
a physical print in the studio, rather than used as a badge.

## Illustration strategy

The studio is built from semantic DOM and CSS shapes, matching the garden's
flat silhouettes and restrained cut-paper shadows. There is one composition
system for every device, theme, and motion preference—no WebGL mode and no
stylistically different fallback. The archive remains the complete conventional
route.

## Light and motion

Soft daylight, simple color fields, and short offset shadows make the objects
feel printed and assembled by hand. Night mode changes the room's palette rather
than its identity.

Night continues outdoors. The threshold opens onto a moonlit blue-green sky,
and layered star fields remain behind the garden sections; foliage, papers, and
the path keep enough tonal separation to stay legible without looking like a
dark overlay on the daylight scene.

Motion is asynchronous and environmental: cloud drift, breathing foliage, and
small paper or plant movement. No synchronized entrance preset. Pointer response
is subtle and never required. Reduced motion freezes the props while retaining
the spatial composition and direct interaction.

## Below the hero and inner pages

DOM content inherits paper, cork, editorial margin, annotation, object shadow,
and asymmetric scrapbook rhythms. It does not revert to generic cards, pills,
timelines, dashboards, or CTA banners. Project pages should feel like opening
the hero object while keeping their real engineering facts easy to scan.

Not every page uses WebGL. About feels like another corner of the studio; Now is
the desk's current sheet; Archive stays unmistakably usable; notes and journal
pages prioritise reading.

## The garden outside — 20 August 2026

The studio is one CSS illustration across desktop and mobile. The empty desk is
intentional: human presence is implied through personal objects and active work.

The first long scroll is now a physical journey: the visitor gets up from the
desk, pushes through the studio doors, and arrives in *Khwabon ka Bagh*. The
garden then holds the work shelf, fragments, and invitation. Karachi and London
are paired as coordinates and lived places, not reduced to flag decoration.

Controls should feel like small physical objects. Press depth, ripples, pointer
pull, restrained synthesized clicks, and device vibration reinforce real
buttons while preserving keyboard focus and reduced-motion behavior. Sound is
always opt-in. The turntable accepts a local audio file, a direct audio URL, or
a Spotify/Apple Music share URL and never autoplays on arrival.

## Responsive behavior

Desktop, tablet, and mobile are separate crops of the same illustrated room.
Mobile crops closer to the monitor and open window, hides low-priority props,
enlarges semantic targets, and follows with a direct project shelf.

## Anti-patterns

No purple gradients, glassmorphism, neon, bento grids, floating pills, giant
marketing hero copy, logo clouds, generic 3D packs, stock/Spline mascots,
cyberpunk terminals, particles, visible construction grids, identical card
animations, fake data, or novelty game UI. Playful means authored and observant,
not childish.

## Review standard

Judge screenshots, not intent, at desktop, laptop, tablet, mobile, reduced
motion, day, and night. The hero does not pass until it reads as an authored
little world, feels continuous with the garden, lets color come from the room,
and avoids the look of a generic landing page.
