# BUILD SPEC — new pages for the Gregory Shepard rebuild (read fully before writing any file)

## Paths
- **Site root (write pages here):** `C:\Users\User\OneDrive\Documents\New project\website-redesign\`
  ⚠️ Always include `OneDrive\` — the path without it is a broken mirror.
- **Content source (zip export, read-only):** `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Claude-Projects-Gregory-Project\d53812a1-0bc1-460d-864f-7136afd83c23\scratchpad\zipsource\`
- Do NOT touch `dist/`, `site.css`, `site.js`, or any existing page.

## What you're doing
Rebuild the assigned zip pages as new flat HTML files in the site root. **Content (copy,
headings, section order, hierarchy) comes from the zip source page. Visuals come ONLY from
the existing `site.css` component system** (navy/electric-blue "Editorial Authority" brand).
Never copy the zip's CSS, fonts (Cinzel), or cream/bronze palette. Improve clarity and
hierarchy where the source is weak — you are building a premium evolution, not a port.

## Page skeleton (use exactly; chrome is stamped by a script later — leave header/footer EMPTY)
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE — Gregory Shepard, The Startup Architect</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;800&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta name="description" content="One sentence, written from the page content.">
</head>
<body>

<header class="nav"></header>

<!-- page sections here -->

<footer></footer>

<script src="site.js" defer></script>
</body>
</html>
```

## Component recipes (copy structure from existing pages when unsure — e.g. advisory.html, about.html)
- **Interior hero (section pages):**
  `<section class="hero interior"><div class="hero-compass"></div><div class="wrap"><div class="hero-copy"> [crumbs] <h1>…</h1><div class="hero-arch">KICKER · WORDS</div><div class="hero-lead">One-line value prop.</div><p class="sub">…</p><div class="hero-actions"><a class="btn btn-blue" href="…">CTA</a><a class="tlink" href="…">Secondary →</a></div></div><div class="hero-media"><div class="hero-portrait" style="background-image:url('assets/real/X-cut.png')"></div></div></div></section>`
- **Slim hero (deep/product/detail pages — no portrait):** same but `class="hero interior slim"` and NO `.hero-media` div.
- **Breadcrumbs (first thing inside `.hero-copy`):**
  `<div class="crumbs"><a href="index.html">Home</a><span class="sep">◆</span><a href="PARENT.html">Parent</a><span class="sep">◆</span><span>Current</span></div>`
- **Stats band:** `<section class="stats"><div class="wrap"><div class="stat"><b>N</b><span>Label</span></div>×4</div></section>` — numbers ONLY from source copy.
- **Split section:** `<section class="block framework"><div class="wrap"><div><div class="sec-head"><span class="eyebrow">…</span></div><h2 class="sec-title">…</h2><div class="lead">…</div><p>…</p><ul class="checklist"><li>…</li></ul><a class="tlink">…</a></div><div class="book-stage"><img …></div></div></section>` (or put a `.photo` div like darksplit)
- **Dark split:** `<section class="block darksplit">` — see speaking.html/index.html.
- **Card grid:** `<section class="block cardsec light"><div class="wrap"><div class="sec-head">…</div><div class="grid3">(or grid4)<div class="card"><div class="img" style="background-image:url('…')"></div><div class="body"><h3>…</h3><p>…</p><a class="tlink" href="…">…</a></div></div>…</div></div></section>` — `.cardsec` = light grey bg, `.cardsec light` = white.
- **Product card (Shop only):** `.card prod` variant: `<div class="card prod"><div class="img"><span class="ph">TWO-WORD MONOGRAM</span></div><div class="body"><h3>Product name</h3><p>Short line.</p><div class="meta"><span class="price">$XX</span><span class="badge soon">Coming Soon</span></div></div></div>` — NO real product photos exist; the `.ph` monogram tile is the intended look. Use `.badge` (blue) for "New/Available", `.badge soon` for coming soon, `.badge free` for free.
- **Pricing tiers (Workshops):** `<div class="tiers"><div class="tier [feat]"><div class="tag">SL-200</div><div class="amt">$X,XXX</div><div class="per">per team · 2 days</div><ul class="checklist"><li>…</li></ul><a class="btn btn-blue" href="contact.html">…</a></div>…</div>`
- **Topics dark checklist:** `<section class="block topics">` — see speaking.html.
- **Marquee quote:** `<section class="marquee">` — see advisory.html.
- **Creds row:** `<section class="creds">` — see advisory.html/about.html.
- **Press/logo strip:** `<section class="press">` — text logos only, names ONLY from source.
- **Quotes:** `.quote` cards WITHOUT `<img>` (text-only attribution: `<div class="person"><div><b>Name</b><span>Role</span></div></div>`). Never attach the 3 testimonial photos to new names.
- **Footer CTA band:** `<section class="cta">` — copy from advisory.html, adjust copy/links.

## Available images (ONLY these; pick what fits the page's subject)
`assets/real/`: hero-cut.png, hero-greg.jpg, grey-blazer.jpg, grey-blazer-cut.png, maroon.jpg, maroon-cut.png, outdoor.jpg, podium.jpg, portrait-smile.jpg, portrait-smile-cut.png, slides.jpg, speaking-2.jpg, speaking-3.jpg, speaking-4.jpg, speaking-hero.jpg, standing.jpg, standing-cut.png, table.jpg, whiteboard.jpg
`assets/`: advisory-1.jpg … advisory-4.jpg, book-cover.png, cta-portrait.jpg, speaking-main.jpg, speaking-thumb-1..5.jpg, g-brain.svg, g-summit.svg, g-network.svg, hero-lineart.svg
Testimonial headshots (cory/elizabeth/zach) are RESERVED — do not use.
If a source page needs an image type we don't have (e.g. product shots, partner logos), use the `.ph` monogram tile, an SVG (g-*.svg), or a text treatment — never a wrong-subject photo, never a hotlink.

## Cross-link map (zip URL → our flat file)
`/` → index.html · `/about` → about.html · `/about/biography` → about-biography.html · `/about/neurodivergent` → about-neurodivergent.html · `/about/quests` → about-quests.html · `/about/causes` → about-causes.html · `/advisory` → advisory.html · `/advisory/board` → advisory-board.html · `/advisory/venture` → advisory-independent-director.html · `/advisory/innovation` → advisory-innovation.html · `/speaker` → speaking.html · `/speaker/lectures` → lectures.html · `/speaker/workshops` → workshops.html · `/speaker/keynotes` → speaking.html#topics · `/author` → author.html · `/author/startup-lifecycle` → startup-science.html · `/authority` → authority.html · `/authority/watch|listen|read|experience` → authority-*.html · `/ventures` → ventures.html · `/ventures/startups` → ventures-startups.html · `/ventures/investments` → ventures-investments.html · `/shop` → shop.html · `/shop/apparel` → shop-apparel.html (+ -tshirts/-hoodies/-truckers) · `/shop/merch` → shop-merch.html · `/shop/music` → shop-music.html · `/community` → community.html · `/connect` → contact.html · events page → events.html · free live masterclass → know-your-phase.html · workshop detail pages → workshop-2day.html / workshop-5day.html

## Hard rules
1. NO invented facts, stats, prices, dates, or claims — only what the source page states. If the source shows a placeholder, keep it neutral ("Coming soon") rather than inventing.
2. Shop is front-end only: buy buttons are `<a class="btn btn-blue" href="contact.html">Notify Me</a>`-style, never fake checkout.
3. Each page must be complete and self-consistent: no lorem ipsum, no TODO markers, no empty hrefs except the chrome placeholders.
4. Section rhythm: alternate dark/light sections; end with the `.cta` band. 4–7 sections per page is right; don't pad.
5. Em-dashes are fine in web copy, but never invent contact emails/phones.
6. When done, list every file you wrote + one line on what sections it has. Do not sync dist.
