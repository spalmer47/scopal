# Walking Skeleton — Scopal Firm Website

**Phase:** 1
**Generated:** 2026-05-07

## Capability Proven End-to-End

A visitor navigating to `https://scopalfirm.com/` receives a static Astro-rendered placeholder homepage served by Vercel's edge CDN with all six security headers (CSP, X-Frame-Options=DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS preload), a footer carrying NAP + attorney advertising line + UPL/no-attorney-client disclaimers (rendered via `BaseLayout` from `src/lib/constants.ts`), and inline `LegalService` JSON-LD — auto-deployed via Git push to `main` and gated by a 5-check CI pipeline (banned-words, axe-core, linkinator, gitleaks, Lighthouse).

(For a static legal-marketing site there is no DB. The "real read/write" surface is replaced with a real production-served page that reads from the `FIRM` constant and writes via the build pipeline. Phase 4 introduces the only server endpoint — the contact form.)

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro 6 (`^6.3`) with `output: 'static'` | Stack locked per CLAUDE.md; static-first maximizes CDN cache hit rate; per-route `prerender = false` reserved for Phase 4 contact endpoint (D1) |
| CSS | Tailwind v4 via `@tailwindcss/vite`; CSS-first config in `src/styles/global.css` (`@theme {}`) | v4 mandatory; `@astrojs/tailwind` deprecated; no `tailwind.config.js`/`postcss.config.cjs` (D2) |
| Adapter / hosting | `@astrojs/vercel` v10 with `webAnalytics.enabled: true`, `imageService: true`, region `iad1`; deployed on Vercel | Stack locked; first-class Astro support; managed TLS; auto-deploy on push to `main` (D3) |
| Data layer | None in v1. Static content collections via Astro 6 `glob` loader at `content.config.ts` (`blog`, `practiceAreas`, `team` with Zod schemas) | No client portal; no database needed for marketing site (D5) |
| Auth | None | No authenticated area in v1 (out of scope per REQUIREMENTS) |
| Security headers | Declared in `vercel.json` `headers[]` block — applies to every response including static assets | Single declarative file; Vercel platform applies them at edge (D13) |
| Layout hierarchy | `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`. Disclaimers injected by layouts (Footer rendered unconditionally), never by page authors | Compliance-by-construction: page author cannot omit attorney advertising / UPL / no-AC-relationship disclaimers (D7, FOUND-07) |
| Single source of truth | `src/lib/constants.ts` — firm NAP, bar admissions, social URLs, banned vocabulary; consumed by Footer, JSON-LD, Schema components, and CI banned-words script | Prevents NAP drift across footer / JSON-LD / future GBP listings (D9, D15, FOUND-04) |
| JSON-LD | Emitted via dedicated `.astro` components using `<script type="application/ld+json" set:html={...}>`; `LegalService` on `/` only in Phase 1 | CSP-compatible (non-executable script `type`); testable; never raw inline strings in pages (D8) |
| Fonts | Self-hosted woff2 in `public/fonts/`. Max 2 families × 2 weights total. Above-fold weight preloaded; `font-display: swap` | No Google Fonts (privacy + perf); D10 cap |
| Typography choice | Body: `Inter` 400. Display: `Fraunces` 600. (UI-SPEC overrides RESEARCH.md `Playfair Display` example.) | UI-SPEC is authoritative for visual tokens |
| Color tokens | `--color-surface` (white), `--color-ink` (deep ink), `--color-brand-blue-500/600`, `--color-brand-orange-500`, `--color-border`, `--color-ink-muted`, `--color-destructive-600` — all OKLCH in `@theme {}` | UI-SPEC 60/30/10 system; orange decorative-only |
| Spacing scale | 8 tokens: `xs=4 sm=8 md=16 lg=24 xl=32 2xl=48 3xl=64 4xl=96` (px) — declared in `@theme {}` | UI-SPEC checker required `4xl=96` to be in the declared table to match desktop section padding |
| JS posture | Zero JS by default in Phase 1. Future mobile menu + contact form = vanilla `<script>`. No React/Vue islands in v1 | D12; supports zero-JS Lighthouse perf budgets |
| CI / merge gate | GitHub Actions on every PR + push to `main`: banned-words, build, linkinator, axe-core, Lighthouse CI (`@lhci/cli`), gitleaks. Must be green to merge | Vercel doesn't gate merges — only deploys; CI must live on GitHub |
| Secret management | All secrets in Vercel env vars only. `.env`/`.env.local` gitignored. `.env.example` is the only env file ever committed. gitleaks runs on every PR | D7 + CLAUDE.md security non-negotiables |
| Directory layout | `public/` static assets · `src/components/{layout,legal,seo}/` · `src/layouts/` · `src/lib/constants.ts` · `src/pages/` · `src/styles/global.css` · `src/content/{blog,practice-areas,team}/` · `content.config.ts` (root) · `vercel.json` (root) · `.github/workflows/ci.yml` · `scripts/banned-words.mjs` | Mirrors RESEARCH.md ARCHITECTURE.md §2; phase-1 subset |
| Domain / TLS | Custom domain `scopalfirm.com` added in Vercel before DNS cutover (so cert is pre-provisioned); managed Let's Encrypt; HSTS preload submitted post-stability | Avoids cert-warning window during DNS cutover |

## Stack Touched in Phase 1

- [x] Project scaffold (Astro 6, TypeScript strict, Tailwind v4, MDX integration, Sitemap integration, Vercel adapter, Lighthouse CI, axe-core, linkinator, gitleaks)
- [x] Routing — `/` route serves `src/pages/index.astro` rendered through `MarketingLayout` → `BaseLayout`
- [x] Data plane — `src/lib/constants.ts` is the read source; consumed by Footer, FooterDisclaimer, LegalServiceSchema, SEO components, and `scripts/banned-words.mjs`. (No DB; not applicable for static marketing site.)
- [x] UI — Header (wordmark + desktop CTA), Footer (NAP + 3 disclaimers + copyright), placeholder homepage (H1 + tagline + body + `mailto:` CTA). Skip-to-content link on every page. Zero client JS.
- [x] Deployment — `https://scopalfirm.com` live on Vercel edge CDN; auto-deploys on push to `main`; CI gates PR merges.

## Out of Scope (Deferred to Later Slices)

- Real homepage copy, hero image, StoryBrand structure → Phase 2
- Persistent / sticky CTA, mobile menu, scroll-aware header → Phase 2
- Trust strip with prior-employer marks → Phase 2
- Practice area pages, attorney bios, pricing page → Phase 3
- Contact form (Astro Action + Resend + 7 server-side controls) → Phase 4
- Blog index, blog posts, RSS feed, MDX content → Phase 4
- Legal pages (`/legal/disclaimer`, `/privacy`, `/terms`, `/accessibility-statement`) → Phase 4
- Per-page-type JSON-LD beyond `LegalService` (`Person`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`) → Phases 3–4
- OG default image (`/og-default.jpg`) → Phase 4
- `BlogPostLayout`, `PracticeAreaLayout` (full forms) → Phases 3–4 (stubs may ship in Phase 1 only if cheap)
- Pre-commit hooks (Husky/lefthook) → deferred; CI is the binding gate
- HSTS preload list submission to hstspreload.org → post-launch follow-up after stability window
- 404 page visual treatment → Phase 4
- Real favicon / logo SVG → Phase 2/3 (Phase 1 ships the Astro scaffold default favicon)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2:** Replace `src/pages/index.astro` with the StoryBrand homepage (hero → problem → guide → 3-step plan → stakes → success → CTA), persistent CTA, trust strip, `WebSite` + `LegalService` JSON-LD on `/`. Mobile menu pattern lands here when nav has real destinations.
- **Phase 3:** Add `src/content/practice-areas/*.md`, `src/content/team/scott-palmer.md`, `src/content/team/rachel-palmer.md`. Author `PracticeAreaLayout` (auto-injects FAQ + breadcrumbs + CTA + disclaimer callout). Add `/attorneys/scott-palmer`, `/team/rachel-palmer`, `/pricing`. Add `Person`, `Service`, `FAQPage`, `BreadcrumbList` schema components.
- **Phase 4:** Add `src/pages/api/contact.ts` (the only `prerender = false` route), Astro Action + Zod + chosen email provider, ABA 477R disclaimer above submit, 7 server controls. Add `BlogPostLayout`, `/blog/`, `/blog/[slug]`, `/rss.xml`, first published post. Add `/legal/*` pages. Promote `<SEO />` to full per-page OG override. Pre-launch security audit + HSTS preload submission.
