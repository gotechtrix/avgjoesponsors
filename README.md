# avgjoesponsors

Sponsor promo pages for **The Average Joe's MBA** events, served via Cloudflare Pages.

## Structure (URL ↔ file)

| URL | File |
|-----|------|
| `/` | `index.html` — landing: sponsors + events |
| `/colbybell/` | `colbybell/index.html` — Colby Bell's sponsored events |
| `/colbybell/secret-sauce-elk-grove-july-23-2026/` | `colbybell/secret-sauce-elk-grove-july-23-2026/index.html` — full promo kit |

Brand assets (`logo.svg`, `favicon.svg`) live at the repo root and inside each event folder.

## Cloudflare Pages setting

For the URLs above to resolve, the Pages project's **build output directory must be the repo root** (`/`). If it is set to a subfolder, that subfolder becomes the site root instead.
