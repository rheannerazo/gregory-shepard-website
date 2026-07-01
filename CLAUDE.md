# Gregory Shepard Website — Design & Build Brief

Static 9-page site, no framework. Read this before touching design or markup.

## Files
- `site.css` — single source of truth for all design. Edit once, every page updates.
- `dist/` — deploy payload (must mirror `site.css` + each `.html` after every edit —
  copy explicitly, nothing auto-syncs).
- 9 pages: index, about, advisory, contact, know-your-phase, media, resources, speaking,
  startup-science. `.hero` is shared; `.hero.interior` is the compact variant for the 8
  non-homepage pages. Homepage-only markup (portrait overlap, meta-rail, mask-up name)
  must stay scoped with `:not(.interior)` or homepage-only HTML — never leak into interior pages.

## Brand tokens (don't invent new ones — extend these)
- Navy `#0A1730` / `#071225`, electric blue `#1A8CF0` / `#6BB6FF`, bronze micro-accent `#C89253`.
- Type: Anton (display/headlines), Inter (body), Montserrat (labels/nav/eyebrows).
- `--maxw: 1380px` content column. Body background is navy (`var(--navy)`) — needed so the
  floating pill nav has no white gap behind it; don't revert to white without re-checking the nav.

## Rules to avoid "AI slop" (learned the hard way this project)
1. **No flat single gradients as a hero background.** Layer texture: grain (SVG turbulence),
   a slow-drifting aurora (multiple radial-gradients + keyframe position shift), and/or a
   subtle schematic/blueprint dot pattern. A flat `linear-gradient` hero reads as a template.
2. **Real photography over stock-feeling crops.** Every card/section photo should be an
   actual Gregory photo from `assets/real/` or `assets/advisory-*.jpg` — never a generic
   business-stock placeholder (`table.jpg`/`whiteboard.jpg` were replaced for this reason).
3. **Full-bleed photo sections need a light overlay, not a heavy one.** A dark gradient
   overlay above ~75% opacity washes the photo out entirely and reads as a blank color
   block instead of "editorial photo break." Keep peak opacity under ~70%, verify the photo
   is actually recognizable through it before shipping.
4. **Decorative flourishes must read as intentional at a glance, not as a bug.** A custom
   SVG mask/icon that's asymmetric, mispositioned, or ambiguous (e.g. one laurel leaf and
   not its mirror) looks like a rendering error, not a design choice. If a symmetric pair,
   verify BOTH sides render identically before moving on.
5. **Numbers and copy must be sourced from what's already approved on the page.** Never
   invent a stat, date, or credential for a "trust badge" or meta-rail — reuse existing
   approved text (e.g. the four pillar roles, the four stats band numbers).
6. **Nav/hero as one visual plane.** If the nav floats over the hero (rounded/inset "pill"
   style), the section behind it must share the hero's dark background all the way to the
   top of the viewport — a sticky-but-still-boxed nav with the page's white background
   showing above it reads as broken, not floating.
7. **Nothing is finished until verified in the actual browser at real viewport width**
   (this project targets ~1536px effective on a 1920×1080/125%-DPI laptop) — clamp()
   ceilings that look fine in isolation can render 15-20% smaller than intended once the
   real device-pixel-ratio is accounted for.

## Design review workflow
Opus designs (spec exact before→after CSS/HTML strings) → Sonnet subagent implements
verbatim, syncs to `dist/`, reports ✅/❌ per edit → Opus renders in Chrome MCP and verifies
at real scale before calling it done. Don't skip the verify step — several "done" edits
this project shipped visible bugs (nav gap, washed-out photo overlay, malformed badge) that
only surfaced once actually rendered.
