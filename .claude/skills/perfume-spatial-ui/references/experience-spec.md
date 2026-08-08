# Experience spec — "2050 Fragrance Lab"

Locked creative direction for Note Match. This is the aesthetic contract — treat deviations as bugs, not style choices, unless the user explicitly asks to change one of these.

## Identity

Cinematic, minimal, restrained luxury fragrance house crossed with an advanced laboratory / AI interface. Editorial typography, one accent color, genuine depth (not decorative gradients). Explicitly **not**: 1990s dark webpage, gaming UI, generic cyberpunk, neon, crypto-site aesthetics.

## Palette (`app/globals.css`, always dark, no light mode)

- `--background: #0b0b0c`
- `--foreground: #f2efe8`
- `--surface: #131211`, `--surface-muted: #1a1815`
- `--border: #2a2723`
- `--muted-foreground: #9a958c`
- `--accent: #c2a878` — the single accent, warm bronze/amber. Used for the cursor glow, atmosphere blobs, and small highlight text. Don't introduce a second accent hue.
- Note/family colors (`lib/family.ts`, `FAMILY_STYLES`) are a functional category legend, not decorative chrome — leave them alone during aesthetic passes.

## Typography

- **Fraunces** (`next/font/google`, `--font-fraunces`) — editorial display serif for large headlines.
- **Geist Mono** — small technical/uppercase labels (tags, nav numbers, cursor hover labels).
- **Geist Sans** — body copy.

## Motion

- `motion` (Framer Motion) only, for every DOM-layer animation. No GSAP.
- Chained `useSpring` (each layer's motion value sourced from the previous layer's output) is the house technique for anything that should feel like it's trailing or dissolving — used by the cursor, reusable for future trailing effects.
- `useScroll`/`useTransform` for anything scroll-linked — prefer this over IntersectionObserver-triggered CSS animations for continuous effects.
- Reusable primitives already built: `components/motion/RevealText.tsx` (staggered word reveal), `components/motion/MagneticButton.tsx` (pointer-follow micro-interaction), `components/motion/PageMaterializeOverlay.tsx` (iris-wipe page transition, used via `app/perfume/[id]/template.tsx`).

## 3D (`three` + `@react-three/fiber` + `@react-three/drei`)

- Used for the perfume detail page bottle only (`PerfumeBottle3D.tsx` — `MeshTransmissionMaterial` bottle + `ParticleField`). The homepage hero is **no longer WebGL** (see "Homepage hero: scroll-scrubbed real video" below) — two prior fully-abstract attempts (an orbital particle ring, then a procedural Mars planet) were both rejected by the user as not reading as premium; the working direction turned out to be real photography/video, not more abstract 3D. Don't reintroduce a generated 3D object as the homepage's primary visual without checking first.
- Always dynamically imported with `next/dynamic({ ssr: false })` from a client-component boundary — never import Three.js directly into a Server Component.
- Always layered `absolute inset-0` behind a `relative z-10` DOM content layer holding real, accessible, fully-functional UI — the 3D layer is decoration, never load-bearing for functionality.
- Gate on `useHeroCapabilities` (`lib/useHeroCapabilities.ts`): starts in a `"checking"` state (SSR-safe), resolves `prefers-reduced-motion` + WebGL support client-side.
- Perf levers, in priority order: `dpr` cap (`[1,1.5]` mobile / `[1,2]` desktop — the dominant lever since `MeshTransmissionMaterial`'s refraction cost scales with pixel count), particle count reduction on mobile (`isMobile` checks via `window.innerWidth < 768`, not UA sniffing), `frameloop` toggled via `IntersectionObserver` when off-screen. No HDRI/`<Environment>` — plain `ambientLight` + tinted `pointLight`s only, to avoid an external asset fetch.

## Homepage hero: floating composition (`components/experience/FloatingHero.tsx`)

Third and current direction, superseding both the earlier abstract-3D attempts (orbital ring, Mars planet) and the scroll-scrubbed video hero that followed them. The video hero read as too static/photographic for what the user wanted; this direction restores an abstract, alive, choreographed feel but keeps a real product photo as the central object rather than a generated 3D model.

- **Central object** (`components/experience/CentralBottle.tsx`) — `public/hero/bottle-float.jpg`, the same real user-provided bottle photo used throughout the project, edited (Runway `generate_image`, hand digitally removed and glass reconstructed) so the bottle floats alone with nothing holding it. Composited with `mixBlendMode: "screen"` against the site's dark background (pure black in the source photo becomes transparent). Built with a spring pointer-tilt (`rotateX`/`rotateY` from normalized pointer position) and a gentle continuous float loop (`useAnimationControls`, entrance variant → infinite float variant) so a future GLB/GLTF model could drop into the same wrapper without restructuring. Don't replace this with a procedural/abstract 3D object without checking first — that's been rejected twice before (see git history: GalaxyRing, MarsPlanet).
- **Floating ingredients** (`components/experience/FloatingIngredient.tsx`) — 7 abstract, restrained fragrance-related shapes (bergamot, vanilla pod, petal, oud wood, peppercorn, glass droplet, amber glow), each with its own depth (0-1, drives parallax strength/blur/opacity/scale), independent float timing/amplitude/rotation ("different mass"), and staggered edge-entrance. Config lives in `FloatingHero.tsx`'s `INGREDIENTS` array.
- **Pointer parallax** (`lib/usePointerParallax.ts`) — normalized (-1..1) pointer position relative to the hero section, spring-smoothed (stiffness 60/damping 20), consumed by both the bottle and every floating ingredient with different multipliers per depth. Resets toward center on pointer-leave and tab-hidden; disabled outright under `prefers-reduced-motion` or on touch (`hover:hover` media check).
- **Entrance choreography** — atmosphere is already present (global `AtmosphericBackground`), ingredients start entering ~0.2s, bottle resolves into focus ~0.5s, headline masks in ~0.8s (`components/motion/MaskReveal.tsx`), search interface arrives last ~1.3s. All within the initial viewport — the homepage is no longer split into a scroll-gated second section; search is part of the entrance sequence, not something the user has to scroll to find.
- **Scroll exit** — same house dissolve technique as the old video hero (`useScroll` + opacity/scale/blur driven by `scrollYProgress`), applied to the whole hero section as one unit rather than choreographing every object's exit individually.
- `useReducedMotion()` skips the floating-ingredients layer and the scroll-linked dissolve entirely.

## Cursor (`components/CustomCursor.tsx`, mounted once in `app/layout.tsx`)

- "Meteor" cursor: bright energy core (`CORE_SPRING`, stiffness 900/damping 42) + 5 chained glow layers (`GLOW_LAYERS`, largest/faintest/loosest-spring first, rendered back-to-front) that read as one continuously dissolving tail, not separate trailing dots.
- `mixBlendMode: "screen"` on every glow layer, radial-gradient from `var(--accent)` to transparent.
- Hover labels via **event delegation** — a single `mouseover`/`mouseout` on `window`, `.closest('[data-cursor]')` — never attach per-element listeners. Opt an element in with `data-cursor="Label"` (e.g. `"Open"`, `"View"`, `"Rotate"`); add `data-cursor-strong` to boost glow size 1.7× for hero-scale targets (currently only the perfume-page bottle container).
- Gated on `matchMedia("(hover: hover) and (pointer: fine)")` and `!prefers-reduced-motion` — renders `null` otherwise (touch devices get the normal system cursor, no broken fixed-position ghosts).
- Global `cursor: none !important` on `html, body, a, button, [role="button"]`; `input, textarea` keep `cursor: text`.

## Atmosphere (`components/experience/AtmosphericBackground.tsx`, mounted once in `app/layout.tsx`)

- Three large, heavily-blurred (`blur-[100–120px]`), low-opacity radial-gradient blobs, `position: fixed`, drifting vertically at different rates via `useScroll`/`useTransform` on `scrollYProgress` — not a parallax "wallpaper," a continuous environment the whole site scrolls through.
- Opacity fades from `0.55` near the top to `0.16` deep in the page (`useTransform(scrollYProgress, [0, 0.12, 1], [0.55, 0.28, 0.16])`) — the "descent" feeling comes from this fade plus the differing drift speeds, not from any single big effect.
- Default color is `var(--accent)`; a page *may* pass a different `color` prop for local tinting (e.g. a family-specific color) but the current site-wide mount uses the default everywhere for consistency — don't reintroduce per-page mounts (see implementation-checklist.md).
- `mix-blend-mode: screen` throughout so it only ever adds light, never darkens or obscures content.

### Stacking-context rule (real bug, already fixed once — don't reintroduce it)

A `position: fixed` element with an explicit `z-index` (even `z-0`) paints **above** plain `position: static` content, regardless of DOM order — because CSS stacking order puts non-positioned static content in an earlier paint layer than any explicitly z-indexed positioned element. `AtmosphericBackground` is `fixed` with `z-0`. To stay visible above it, any ancestor of real page content must be a **positioned element with a z-index ≥ 10** — `app/layout.tsx`'s `<main>` (`relative z-10`) and `components/Footer.tsx`'s `<footer>` (`relative z-10`) already do this globally. If you add a new top-level layout wrapper (a new root-level provider div, a portal target, etc.), it needs the same `relative z-10` treatment or content silently gets painted behind the atmosphere.

## Philosophy

"3 incredible interactions" beats "30 mediocre animations." Prefer one restrained, well-tuned effect over several competing ones. Quality over quantity — this was explicit, repeated user feedback, not a default assumption.
