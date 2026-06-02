# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static marketing website for **Black Mango Creative Studio** — a Czech creative studio (Příbram) offering branding, web design, digital graphics, and marketing services. The site is in Czech and targets Czech/Slovak clients. It deploys to [blackmango.cz](https://blackmango.cz/).

No build toolchain — open `index.html` directly in a browser.

## File Structure

- [index.html](index.html) — single-page site with all sections
- [styles.css](styles.css) — all styles (~1400 lines), organized by section with comment headers
- [script.js](script.js) — all JS (~780 lines), organized by section with comment headers
- [gdpr.html](gdpr.html) — standalone GDPR/privacy policy page

Asset directories: `spolupracujeme/` (partner logos), `weby_ukazky/` (web portfolio screenshots), `carousel_digitalni_grafika/` (digital graphics portfolio), `potfolio_branding/` (branding PDFs + preview images), `tiskoviny/` (print materials), `ikony_nase_sluzby/` (service SVG icons), `Nunito_Sans/` (local font files)

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

Typography: `BlackMango` (custom display font from `Black-Mango-Modern-beauty-font/webfont/`) for headings; `NunitoSans` (local variable font) for body text.

### JS patterns
All JS is vanilla, no frameworks. Each feature is an IIFE or standalone function block with a section comment header. Seamless carousel loops work by duplicating the track group (`aria-hidden="true"` on the copy) and using `requestAnimationFrame` to increment an offset — `recalc()` measures the first group's `getBoundingClientRect().width` as `loopDistance`. Respects `prefers-reduced-motion`.

### Image strategy
Every image has a `.webp` version alongside the original `.png`. Always use `.webp` in HTML for performance. `loading="lazy"` and `decoding="async"` on all below-fold images.

## Key constraints

- **No backend / form handler**: the contact form and chat widget currently show an `alert()` or swap content client-side. Any real form submission requires adding a third-party service (e.g., Formspree, EmailJS).
- **Accessibility**: the site targets WCAG 2.1 AA. Keep `aria-label`, `aria-expanded`, `aria-hidden`, skip-link, and keyboard support intact when editing interactive components.
- **Czech language**: all user-facing copy is in Czech. Don't translate or change copy without instruction.
- **No CDN for fonts**: `BlackMango` is a licensed font served locally from `Black-Mango-Modern-beauty-font/webfont/`. Don't reference it from Google Fonts or a CDN.
