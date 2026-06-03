# Black Mango Creative Studio

Static marketing website for **Black Mango Creative Studio** — a Czech creative studio (Příbram) offering branding, web design, digital graphics, and marketing services. Bilingual (CZ default / EN), deployed to [blackmango.cz](https://blackmango.cz/) via GitHub Pages.

No build toolchain — open `index.html` directly in a browser. See [CLAUDE.md](CLAUDE.md) for architecture and conventions.

## Deployment & SEO files

These root-level files are not part of the site UI but are essential for hosting, search engines, and AI/LLM discovery. **Keep them in sync whenever the domain, pages, services, or contact details change.**

| File | Purpose |
| --- | --- |
| [CNAME](CNAME) | Custom domain for GitHub Pages. Contains `blackmango.cz`. Removing or changing it breaks the live domain. |
| [robots.txt](robots.txt) | Crawler rules. Allows all pages, disallows the licensed-font directory, and points to the sitemap. |
| [sitemap.xml](sitemap.xml) | List of public URLs (home + GDPR) with `lastmod` / `changefreq` / `priority` for search engines. Update `lastmod` when a page changes; add a new `<url>` entry for any new page. |
| [llms.txt](llms.txt) | Curated Markdown summary of the studio (about, services, contact, available pages) for AI assistants / answer engines (ChatGPT, Perplexity, Claude, etc.). Optional but improves how AI tools describe Black Mango. Content is hardcoded Czech and does **not** read from `translations.js`. |

### Maintenance notes

- **New page added** → add a `<url>` entry in `sitemap.xml`, link it in `llms.txt` under "Dostupné stránky", and confirm `robots.txt` doesn't block it.
- **Services or contact info change** → update `llms.txt` by hand (it duplicates info from `index.html` / `translations.js`).
- **Domain change** → update `CNAME`, all absolute `https://blackmango.cz/` URLs in `sitemap.xml`, `robots.txt`, and `llms.txt`.
- **Page content updated** → bump the relevant `<lastmod>` date in `sitemap.xml`.
