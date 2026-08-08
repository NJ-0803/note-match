# Implementation checklist

What's built, where it lives, and what's still roadmap. Check this before adding a page or component so new work reuses the existing pattern instead of reinventing it.

## Global (mounted once, apply to every page automatically)

- `components/CustomCursor.tsx` — mounted in `app/layout.tsx`, first child of `<body>`.
- `components/experience/AtmosphericBackground.tsx` — mounted in `app/layout.tsx`, right before `CustomCursor`.
- Both are global as of the "Make the atmospheric background site-wide" change — **do not** re-mount either one inside an individual page (`app/*/page.tsx`). A page that wants a locally-tinted atmosphere should pass a `color` prop pattern only after discussing it with the user first, since the current design intentionally uses one consistent default tint everywhere.
- `<main>` in `app/layout.tsx` is `relative z-10`; `<footer>` in `components/Footer.tsx` is `relative z-10`. Any new top-level element added as a direct sibling in `app/layout.tsx` needs the same treatment (see the stacking-context rule in `experience-spec.md`).

## Per-page / per-component, already built

- **Homepage** (`app/page.tsx` → `app/HomeClient.tsx`) — deliberately split into two scroll sections, not one continuous block: section 1 is `ScrubVideoHero` (real scroll-scrubbed bottle video, see experience-spec.md), holding the eyebrow, split-line headline ("Own a scent // you love", `//` in accent color), tagline, and intro paragraph — no search UI is visible without scrolling. Section 2 (`SearchBox` + `FreeTextSearch`) uses `whileInView` with a spring "pop" (scale 0.85→1) instead of a time-delayed fade, so it only appears once the user actually scrolls into it. Don't collapse this back into one section without checking with the user first — it's an intentional redesign, not an oversight.
- `HeroExperience.tsx`, `MarsPlanet.tsx`, `StaticHeroFallback.tsx`, and the old `GalaxyRing.tsx` are all deleted — the homepage went through orbital-particle-ring → Mars-planet → real-video before landing on the current approach. If you're tempted to build another abstract 3D hero object for the homepage, re-read the "Homepage hero" section of experience-spec.md first.
- **Perfume detail** (`app/perfume/[id]/page.tsx`) — full-bleed hero with `PerfumeBottleLoader` → `PerfumeBottle3D` (interactive glass bottle, cursor-tilt, `data-cursor="Rotate" data-cursor-strong` on the hero container), `app/perfume/[id]/template.tsx` for the per-navigation iris-wipe entrance (`PageMaterializeOverlay`).
- **Navigation** (`components/Navigation.tsx`) — thin top bar, fullscreen `AnimatePresence` overlay menu with large Fraunces numbered links, menu trigger has `data-cursor="Open"`.
- **PerfumeCard** (`components/PerfumeCard.tsx`) — title link has `data-cursor="View"`.
- **Catalogue, Compare, Collection, About** — themed via the shared tokens, no page-specific 3D or bespoke motion beyond what the global cursor/atmosphere now provide.

## `data-cursor` label conventions already in use

`"Rotate"` (perfume bottle hero, strong), `"Open"` (nav menu trigger), `"View"` (perfume card title link). Keep new labels short, single-word, uppercase-styled by the cursor component automatically — don't invent a different labeling convention per component.

## Explicitly roadmap — do not build unless the user asks

- Orbiting "Scent Universe" note visualizer.
- Fragrance Lab quiz section.
- Asymmetric/editorial catalogue grid redesign.
- Shared-element (bottle-anchored) page transitions beyond the current iris-wipe.
- Dedicated mobile-specific atmosphere simplification beyond the existing particle-count/dpr reductions in `PerfumeBottle3D`/`HeroExperience` (the atmosphere's CSS blobs already degrade gracefully on mobile since they're pure CSS transforms, not WebGL — but no explicit mobile-specific tuning pass has been done on them).

## Known environment quirk (not a product bug)

In the `claude-in-chrome` automated browser testing tool specifically, `requestAnimationFrame`-driven motion (cursor spring position, hero entrance reveal, Recharts animations) can appear stalled until the tab receives a real interaction, because the automated tab doesn't hold real OS focus. This is a testing-tool artifact, confirmed by clicking/hovering to "wake" the tab and seeing correct behavior — don't chase it as a real bug, but do always verify with an actual hover/click + wait step during browser verification rather than trusting the very first screenshot after page load.
