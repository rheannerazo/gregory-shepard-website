# DESIGN v4 SURGERY RULES — read fully, apply exactly to your assigned pages

Site root: `C:\Users\User\OneDrive\Documents\New project\website-redesign\` (always WITH `OneDrive\`).
Do NOT touch site.css, site.js, dist/, tools/, or pages not assigned to you. Do NOT touch the
stamped `<header class="nav">…</header>` or `<footer>…</footer>` blocks.

## 1 · HERO PHOTO SURGERY (kills the AI-cutout look)
Where your page list gives a photo, replace the hero's media div:
FIND (the page's current hero media, whatever cutout/photo it holds):
`<div class="hero-media"><div class="hero-portrait" style="background-image:url('…')"></div></div>`
REPLACE with:
`<div class="hero-media"><div class="hero-photo" style="background-image:url('assets/real/PHOTO')"></div></div>`
(`.hero-photo` = framed, graded, environmental panel — already styled.)
Where the list says **slim**, make the hero `class="hero interior slim"` and DELETE the
`.hero-media` div entirely. If the page already matches, leave it.

## 2 · CANONICAL FACTS (fix every contradiction)
The ONLY numbers allowed as Gregory-level claims, sitewide:
**13 companies founded · 12 exits · $925M cross-brand deal (AffiliateTraction → eBay Enterprise) ·
4 PE Awards · 30+ years operating · TEDx + United Nations speaker · Fulbright Scholar ·
5-star rated book (The Startup Lifecycle, BenBella)**
DELETE/REPLACE wherever found (inventions from an older build):
"15+ years", "90%+ portfolio survival", "100+ companies advised", "1,200+ founders mentored",
"100+ keynotes", "25+ countries", "10+ industries", "15+ years on stages".
Page-specific numbers that came from the zip source (lecture length, $695, worksheet counts,
podcast counts, quest counts, etc.) stay.

## 3 · FACT CHIPS (replaces shouty duplicate stat bands)
Chip row markup, placed inside `.hero-copy` directly AFTER `p.sub`:
`<div class="chips"><span class="chip"><b>12</b> Exits</span><span class="chip"><b>$925M</b> Deal</span><span class="chip"><b>30+</b> Years</span></div>`
Use 3–4 chips max, chosen for the page's subject (your page list says which). When a page's
`.stats` band duplicates hero chips or repeats another page's generic numbers, DELETE the band;
keep `.stats` bands whose numbers are page-specific source facts.

## 4 · VOICE & COPY
- First person ("I", "my") everywhere except quotes/citations. Rewrite third-person self-refs.
- BANNED phrases — rewrite with something concrete: "Maximum impact", "Real results",
  "inspire action", "world-class", "unlock", "elevate", "empower", "game-chang…",
  "cutting-edge", "thought leadership", "high-impact".
- Headline style: short, concrete, declarative. Model on the good ones already live:
  "Nine Transfusions. Twelve Exits. One Thesis." / "Stop learning about startups. Start building one."
  / "Funded. Diluted. Dressed accordingly."
- Sub-paragraphs: one specific fact, then one promise. Max ~3 lines. No adjective stacks.
- Kickers (`.hero-arch`): must add info, not repeat the nav label. "BOARD · ADVISOR · FRACTIONAL OPERATOR"
  is good; "SPEAKING" under a Speaking h1 is not.

## 5 · CTA BAND ENDINGS (one per page, by section — replaces the 30 identical clones)
Swap each page's closing `.cta` copy (keep structure/photo/buttons markup; adjust button labels/links as noted):
- **Offer pages** (advisory*, workshops, workshop-*, lectures, events, startup-science, speaking):
  h2 `Let's find out where your company actually is.`
  p `One conversation. A clear read on your phase, your gaps, and whether I'm the right operator to help.`
  buttons: Schedule a Call → contact.html · ghost: See the Framework → startup-science.html
- **Personal pages** (about*, author, authority*, ventures*, community):
  h2 `The story is context. The framework is the point.`
  p `Everything on this site feeds the same seven-phase system — see how it applies to what you're building.`
  buttons: Explore Startup Science → startup-science.html · ghost: Connect → contact.html
- **Shop pages** (shop*):
  h2 `Wear the doctrine.`
  p `Every piece funds the free founder tools. Drops are small and they don't restock.`
  buttons: Browse All → shop.html · ghost: Get Drop Alerts → contact.html
- index.html and know-your-phase.html keep their existing CTAs.

## 6 · REPORT
List per page: hero action taken, stat band kept/removed, copy lines changed (before → after,
compact). Nothing else. Do not sync dist.
