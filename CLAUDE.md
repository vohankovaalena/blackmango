# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static marketing website for **Black Mango Creative Studio** — a Czech creative studio (Příbram) offering branding, web design, digital graphics, and marketing services. The site is in Czech and targets Czech/Slovak clients. It deploys to [blackmango.cz](https://blackmango.cz/).

No build toolchain — open `index.html` directly in a browser.

## File Structure

- [index.html](index.html) — single-page site with all sections (Czech markup is the source of truth)
- [translations.js](translations.js) — single source for all UI copy (CZ + EN), loaded before `script.js`
- [styles.css](styles.css) — all styles (~1400 lines), organized by section with comment headers
- [script.js](script.js) — all JS, organized by section with comment headers
- [gdpr.html](gdpr.html) — standalone GDPR/privacy policy page (Czech only, no i18n)

### Deployment & SEO files

Root-level files for hosting + search/AI discovery. **Always keep them current** — whenever the domain, pages, services, or contact details change, update these to match (`index.html` / `translations.js` are the source of truth for copy). See [README.md](README.md) for the full maintenance checklist.

- [CNAME](CNAME) — GitHub Pages custom domain (`blackmango.cz`). Don't delete or change without intent; it controls the live domain.
- [robots.txt](robots.txt) — crawler rules; allows all pages, disallows the licensed-font dir, points to the sitemap.
- [sitemap.xml](sitemap.xml) — public URLs (home + GDPR). Add a `<url>` entry for any new page; bump `<lastmod>` when a page changes.
- [llms.txt](llms.txt) — curated Markdown summary for AI assistants / answer engines. Hardcoded Czech; does **not** read from `translations.js`, so update it by hand when services/contact/pages change.

### Vertical slicing (global organizing principle)

The whole project is organized **by page section, not by file type** — each section of the site (hero, partners, services, portfolio, about, contact, …) is treated as a self-contained vertical slice. Apply this everywhere, not just to assets:

- **Markup, styles, and JS** — within [index.html](index.html), [styles.css](styles.css), and [script.js](script.js), keep each section's code grouped together under its own comment header, in the same section order as the page. Don't scatter one section's logic across the file.
- **Assets** — every section owns a folder under `assets/` (see layout below).
- **New section** — add it as a contiguous slice in each of `index.html` / `styles.css` / `script.js`, and create its `assets/<section>/` folder. Anything shared across sections is the exception, kept in a `global` slice (`assets/global/`, `:root` CSS variables, shared JS helpers).

**Rule: every change must preserve this vertical-slicing layout.** Put new code/assets in the slice for the section that uses them — never dump section-specific things in a generic bucket or at the repo root.

#### Asset folders (one application of the principle)

All media lives under `assets/`, one folder per section. Shared brand assets go in `assets/global/`.

```
assets/
├── global/            cross-section brand assets (logo-main, logo-icon, icon-vector, favicon)
├── hero/              hero photo
├── partners/          marquee partner logos
├── services/          flip-card SVG icons
├── portfolio/
│   ├── branding/      PDF preview thumbnails
│   ├── graphics/      digital-graphics screenshots
│   ├── web/           website screenshots
│   └── print/         print-material mockups
├── about/             responsive banner images (desktop/tablet/mobile)
├── contact/           team avatar photos
├── docs/              branding PDFs (opened in the portfolio PDF modal)
├── fonts/
│   ├── black-mango/   licensed display font (woff2/woff)
│   └── nunito-sans/   body variable font (ttf + OFL license)
└── _unused/           orphaned/archived assets kept for reference, not referenced by the site
```

## Architecture

### Single-page layout (index.html sections in order)
1. **Navbar** — sticky, scrolls to anchor links; hamburger on mobile
2. **Hero** — wordmark with inline SVG icon embedded in "Mango"
3. **Partners marquee** — infinite CSS-animated scrolling logos (JS `rAF` loop)
4. **Services** — 4 flip cards (CSS hover + JS click toggle for mobile/keyboard)
5. **Portfolio** — 3 carousels + branding card grid with PDF modal; tiskoviny lightbox
6. **About, References, FAQ** — accordion FAQ
7. **Contact** — form (currently `alert()`-only, no backend), floating chat widget (FAB)
8. **Modals** — PDF preview iframe, image lightbox, exit-intent popup

### CSS conventions
Brand colors are CSS variables in `:root` (see [styles.css:68-74](styles.css#L68-L74)):
- `--color-dark: #0C2320` (deep green, primary text/bg)
- `--color-light: #F5F1EB` (warm off-white)
- `--color-beige: #D6C3A3`
- `--color-brown: #BFA27A`

Typography: `BlackMango` (custom display font from `assets/fonts/black-mango/`) for headings; `NunitoSans` (local variable font from `assets/fonts/nunito-sans/`) for body text.

### JS patterns
All JS is vanilla, no frameworks. Each feature is an IIFE or standalone function block with a section comment header.

**Carousel factory** — all seamless-loop carousels are initialised by `initCarousel(config)` in [script.js](script.js). Pass element selectors, speed, and (optionally) `cardSelector` + `prevSelector`/`nextSelector` for nudge support. Do **not** write a new standalone carousel function — add a new `initCarousel(…)` call instead. The loop works by duplicating the track group (`aria-hidden="true"` on the copy) and using `requestAnimationFrame` to increment an offset; `recalc()` measures the first group's `getBoundingClientRect().width` as `loopDistance`. Respects `prefers-reduced-motion`.

**Modal helpers** — use `openModal(el, focusTarget?)` and `closeModal(el)` for any overlay that locks body scroll and toggles `aria-hidden`. Register a `el._closeModal` property so the unified Escape-key handler (top of [script.js](script.js)) can close it. Do **not** hand-roll `classList.add('is-open') / setAttribute('aria-hidden')` pairs.

**CONFIG object** — all magic numbers (speeds, timeouts, scroll thresholds) live in `const CONFIG = {…}` at the top of [script.js](script.js). Add new constants there rather than inlining literals.

**Active-nav class** — the currently-active nav link gets `.is-active` toggled by JS (see `ACTIVE NAV LINK ON SCROLL` section). The colour is defined in [styles.css](styles.css) as `.nav-menu a.is-active`. Do **not** write `link.style.color = …` inline.

**SVG sprite** — reusable SVG symbols and shared gradient `<defs>` live in the hidden sprite block at the very top of `<body>` in [index.html](index.html). Reference icons with `<svg><use href="#icon-id"></use></svg>`. Reference the peel gradient with `fill="url(#peel-gradient)"`. Add new symbols/defs to that block instead of inlining them per-element.

### Internationalization (CZ / EN)
The site is a **single bilingual page** translated entirely client-side — there is **no second HTML file per language**. Do not create one; that previously caused the two copies to drift out of sync.

- **Single source of truth**: Czech markup lives in [index.html](index.html); every translatable string (CZ + EN) lives in [translations.js](translations.js) as `BM_TRANSLATIONS`; language logic lives in `applyLang()` in [script.js](script.js).
- **To add a translatable string**: put `data-i18n` (text), `data-i18n-html` (innerHTML), `data-i18n-placeholder`, or `data-i18n-aria` (aria-label) on the element in `index.html`, then add the matching CZ + EN keys in `translations.js`. `meta.title` / `meta.description` drive the document title and meta description per language.
- **Switching**: `applyLang()` swaps content in place — no navigation/reload. The choice persists in `localStorage` (`bm_lang`) and is reflected in the URL as `?lang=en` (shareable). CZ is the default.

### Image strategy
Every image has a `.webp` version alongside the original `.png`. Always use `.webp` in HTML for performance. `loading="lazy"` and `decoding="async"` on all below-fold images.

## Key constraints

- **No backend / form handler**: the contact form and chat widget currently show an `alert()` or swap content client-side. Any real form submission requires adding a third-party service (e.g., Formspree, EmailJS).
- **Accessibility**: the site targets WCAG 2.1 AA. Keep `aria-label`, `aria-expanded`, `aria-hidden`, skip-link, and keyboard support intact when editing interactive components.
- **English identifiers**: all folder names, file names, JS variables/functions, and CSS class & custom-property names must be in English. Only user-facing copy/content is Czech — code and filesystem identifiers are never Czech.
- **No CDN for fonts**: `BlackMango` is a licensed font served locally from `assets/fonts/black-mango/`. Don't reference it from Google Fonts or a CDN.
