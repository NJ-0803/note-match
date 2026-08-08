---
name: perfume-spatial-ui
description: Design and interaction language for Note Match's "2050 Fragrance Lab" identity — dark cinematic palette, meteor cursor, scroll-linked atmosphere, WebGL bottle/hero. Use before any visual, motion, or new-page work on this site so it stays consistent instead of drifting toward generic/gaming/cyberpunk UI.
---

# Note Match — Spatial UI

This site's identity is "2050 luxury fragrance house," not 1990s dark webpage, not gaming UI, not generic cyberpunk, not cheap neon. Read `references/experience-spec.md` before making any visual or motion decision — it has the locked palette, typography, cursor, and atmosphere rules. Read `references/implementation-checklist.md` before adding a new page or component — it says what already exists, where it lives, and what's explicitly still roadmap (don't build roadmap items unless asked).

## When to use this

- Before styling or animating any new or existing page.
- Before adding a new interactive element (button, card, hero) that should carry the cursor/hover-label system.
- Before proposing a "redesign" or reacting to inspiration (a video, a link, a screenshot) — check it against the locked decisions here first, and confirm with the user before changing anything, rather than silently reinterpreting the aesthetic.

## Non-negotiables (see experience-spec.md for detail)

1. One accent color (`--accent`, warm bronze `#c2a878`), always-dark palette. No neon, no multi-color gradients, no light mode.
2. Motion library only (`motion`/Framer Motion) for DOM animation — no GSAP. Three.js/`@react-three/fiber`/`drei` for 3D, nowhere else.
3. Restraint over density: "3 incredible interactions" beats "30 mediocre animations." If a new effect competes with the cursor or atmosphere for attention, cut it back.
4. Every page gets the cursor + atmosphere via the root layout automatically — do not remount `CustomCursor` or `AtmosphericBackground` per-page (see implementation-checklist.md for why, and the stacking-context rule that goes with it).
5. `prefers-reduced-motion` and non-fine-pointer devices must always get a functional, non-broken fallback — never a blank or broken page.

## Workflow

1. Read both reference docs.
2. State the specific change against the spec (what page, what element, which non-negotiable it touches).
3. Ask the user to confirm before editing, unless they've already explicitly approved the exact change in this conversation.
4. After implementing: `npm run build`, visually verify in the browser (cursor + atmosphere + the new element together, not in isolation), then follow the project's normal commit/push/deploy flow.
