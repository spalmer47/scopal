# Research Synthesis — Scopal Firm Website

**Synthesized:** 2026-05-07
**Inputs:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md, FIRM_BRIEF.md, PROJECT.md, .claude/CLAUDE.md
**Audience:** Planning agents producing per-phase plans. Dense by design — every line is a decision or constraint.

---

## 1. Cross-Cutting Decisions (Resolved Across Multiple Files)

| # | Decision | Confirmed In |
|---|----------|--------------|
| D1 | Astro 6 (`^6.3`) in `output: 'static'` mode with `prerender = false` ONLY on the contact endpoint. | STACK §3, ARCH §7 |
| D2 | Tailwind CSS v4 via `@tailwindcss/vite` (NOT deprecated `@astrojs/tailwind`). Use `npx astro add tailwind`. CSS-first config (`@theme {}` block in `src/styles/global.css`). No `tailwind.config.js`. | STACK §2, PITFALLS P1-1 |
| D3 | `@astrojs/vercel` adapter with `webAnalytics.enabled: true` and `imageService: true`. Function region `iad1`. | STACK §3, ARCH §7 |
| D4 | Contact form = Astro Actions + Zod + Resend (server-side), honeypot + IP rate limit + Origin check + HTML-escaped body. **Provider TBD per Scott's intake workflow** — Resend default; Supabase optional for lead storage. | STACK §4, ARCH §7, CLAUDE.md |
| D5 | Content collections via Astro 6 `glob` loader at `content.config.ts` (root). Three collections: `blog`, `practiceAreas`, `team`. | STACK §5, ARCH §2 |
| D6 | URL structure: `/practice-areas/[slug]`, `/attorneys/[slug]` (licensed only), `/team/[slug]` (non-attorneys). Kebab-case, no trailing slashes. | ARCH §1 |
| D7 | Layout hierarchy: `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`. **Disclaimers enforced by layouts, not page authors.** | ARCH §4, FEATURES F5 |
| D8 | JSON-LD: `LegalService` on `/` and `/about` ONLY (sitewide duplication = spam). `Person` on bios (NOT deprecated `Attorney` type). `Service`+`FAQPage`+`BreadcrumbList` on practice areas. `Article`+`BreadcrumbList` on blog posts. | STACK §6, ARCH §5 |
| D9 | NAP: `areaServed: Country=US` (national service). NAP must match exactly across footer / JSON-LD / GBP / directories. | ARCH §6 |
| D10 | Self-host fonts (woff2) in `public/fonts/`. NO Google Fonts. Max 2 families × 2 weights. Preload above-fold weight. `font-display: swap`. | STACK §6, PITFALLS P1-5 |
| D11 | All images via `astro:assets` `<Image />`. Hero: `loading="eager"` + `fetchpriority="high"`. 200 KB committed-source ceiling. | ARCH §8, CLAUDE.md |
| D12 | Zero JS by default. Mobile menu + form = vanilla `<script>`. No React/Vue islands in v1. | ARCH §8 |
| D13 | `vercel.json` ships security headers from day one: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS. | FIRM_BRIEF, CLAUDE.md |
| D14 | Banned vocabulary: "specialist," "specializing in," "expert," "the best," "#1," "leading," "top-rated." Permitted: "focuses on," "represents clients in," "experienced in." Enforced via lint/grep in CI. | PITFALLS P0-3 |
| D15 | Single source of truth for NAP, bar admissions, social URLs: `src/lib/constants.ts` — consumed by JSON-LD, footer, and contact. | ARCH §3, PITFALLS P1-4 |
| D16 | Pricing: anchor "starting at $4,500/month" displayed publicly. CTA: "Book a fit call" / "Schedule a Consultation." Never "Free Consultation." | FEATURES F7 |
| D17 | Bar status copy: "Maryland (2009); New Jersey admission pending." Schema `barAdmissions[].status: 'active'|'pending'`. Site copy must never imply NJ active until swearing-in. | FIRM_BRIEF |

---

## 2. Top 10 Must-Know Facts for Planning Agents

1. **`@astrojs/tailwind` is DEPRECATED.** Use `@tailwindcss/vite` in `vite.plugins`. No `postcss.config.cjs` or `tailwind.config.js`.
2. **`output: 'static'` + per-route `export const prerender = false` is the mode.** Do NOT set `output: 'server'`. Contact endpoint is the only server-rendered path.
3. **`site: 'https://scopalfirm.com'` in `astro.config.mjs` MUST be set before first deploy** — sitemap, canonicals, OG URLs all derive from it.
4. **`/team/` vs `/attorneys/` is an ETHICS decision.** Rachel → `/team/rachel-palmer`. Routing her under `/attorneys/` implies unauthorized practice.
5. **Disclaimers belong in layouts.** Footer disclaimer in `Footer.astro`. Practice-area disclaimer in `PracticeAreaLayout`. Blog disclaimer in `BlogPostLayout`. ABA 477R notice ABOVE the submit button in `DisclaimerNotice.astro`.
6. **Contact form has 7 mandatory server-side controls:** Origin/CSRF check, honeypot, IP rate limit (5/hour), Zod re-validation, HTML-escape user input, CRLF rejection in header-bound fields, fixed `From:`/`Subject:` (user content in body only).
7. **No `Attorney` schema type** — deprecated. Use `Person` + `worksFor` linking to firm `@id`. `LegalService` on `/` and `/about` only.
8. **Banned-words lint is mandatory CI infrastructure** — attorney editing copy via Claude Code will introduce "specialist"/"expert" without it.
9. **WCAG 2.1 AA from day one.** Run `axe-core` in CI from Phase 1. ADA demand letters target law firm sites specifically.
10. **Audience is SaaS founders, not legal consumers.** Bio pages convert at ~2× homepage rate. Homepage hero is NOT firm history — lead with client problem.

---

## 3. Phase Implications

### Foundation
- Bootstrap: `npm create astro@latest` → `npx astro add tailwind` → `npx astro add vercel`.
- Install: `@astrojs/sitemap`, `@tailwindcss/typography`, `resend`, `@astrojs/mdx`.
- `astro.config.mjs`: `site`, `output: 'static'`, Vercel adapter, `vite.plugins: [tailwindcss()]`, `env.schema`.
- `vercel.json` with security headers + asset caching from commit 1.
- `src/lib/constants.ts` with NAP, bar admissions, social URLs.
- CI from day one: axe-core, banned-words lint, linkinator, gitleaks.
- `.gitignore` includes `.env*`, `dist/`. `.env.example` documents every required var.

### Homepage
- StoryBrand structure: hero → problem agitation → firm-as-guide → 3-step plan → stakes → success → CTA.
- Trust strip: prior in-house employer logos + bar admissions (NOT client logo wall — confidentiality).
- "Proactive legal is cheaper than reactive" insight in first two sections.
- JSON-LD: `LegalService` + `WebSite` with `SearchAction`.
- Performance budget: LCP < 2.0s, CLS < 0.05.

### Practice Areas (3 pages)
- `/practice-areas/fractional-general-counsel`, `/practice-areas/corporate-law`, `/practice-areas/legal-executive-coaching`.
- 800–1,500+ words each. H1 client-focused ("Corporate Legal Support for SaaS Companies").
- `PracticeAreaLayout` auto-injects: disclaimer, FAQ component (emits `FAQPage` schema), breadcrumbs, CTA.
- Frontmatter Zod schema: `title`, `shortTitle`, `description ≤160`, `order`, `faqs[{q,a}]`.

### Attorney / Team Pages
- Scott (`isAttorney: true`) → `/attorneys/scott-palmer`. Rachel → `/team/rachel-palmer`.
- Scott's bio leads with client benefit, then: prior in-house roles (strongest trust signal), bar admissions (MD active 2009; NJ pending), JD + undergrad, representative matters, associations.
- JSON-LD: `Person` with `worksFor`, `alumniOf`, `hasCredential`.

### Contact Form
- Provider decision DEFERRED — present three options to Scott at this phase: (1) Resend-only email, (2) Supabase + Resend with lead storage, (3) Formspree/Web3Forms.
- All 7 server-side security controls mandatory (see §2 #6 above).
- ABA 477R disclaimer ABOVE submit button. HTML form fallback required (a11y).
- Fields: name, email, company, description. Never ask for sensitive matter details before conflict check.

### Blog
- `/blog/` index + `/blog/[slug]`. MDX collection. Every post: `author: 'scott-palmer'`.
- `BlogPostLayout` auto-injects: prose wrapper, disclaimer, `Article` JSON-LD, breadcrumbs, CTA.
- Categories: SaaS Contracts, Privacy & Compliance, Fundraising Legal, Equity & Hiring, Outside GC Playbook.
- `rss.xml.ts`. Filter drafts in production.

### SEO / Metadata
- `<SEO />` component in `BaseLayout.astro`. Title format: `${pageTitle} — ${city} | Scopal Firm` (≤60 chars).
- Per-page-type JSON-LD components (not free-form strings).
- `public/robots.txt`: allow all, `Disallow: /api/`, sitemap URL.
- Validate each page type with Google Rich Results Test before merge.

### Security Hardening
- `vercel.json` CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Pre-commit + CI: gitleaks, banned-words, axe-core, lighthouse-ci with budgets.
- `dist/` audited for leaked credentials before launch.
- If Supabase: RLS on every table.

### Legal Pages + Pre-Launch Review
- `/legal/disclaimer`, `/legal/privacy`, `/legal/terms`, `/legal/accessibility-statement`.
- Footer on every page: NAP, attorney advertising statement, responsible-attorney name, jurisdictions with status, general disclaimer, privacy/terms links.
- Jurisdictional UPL disclaimer: "...licensed to practice law in Maryland; New Jersey admission pending."

---

## 4. P0 Risks Every Phase Plan Must Address

| P0 | Risk | Mitigation |
|----|------|-----------|
| P0-1 | Missing attorney-client disclaimer | Layouts enforce; verify new layout composes correctly |
| P0-2 | Testimonial/past results without disclaimer | `<Testimonial>` requires `disclaimer` prop |
| P0-3 | Banned vocabulary in copy | CI lint blocks merge |
| P0-4 | Jurisdictional UPL disclaimer absent | Footer auto-renders from layout |
| P0-5 | Email header injection | Reject `\r\n` in inputs; fixed `From:`/`Subject:` |
| P0-6 | No server-side validation | Zod re-validation in server action |
| P0-7 | No rate limiting / bot protection | Honeypot + IP rate limit mandatory |
| P0-8 | Secrets committed | `.env*` in `.gitignore`; gitleaks in CI |
| P0-9 | Vercel adapter output mismatch | `output: 'static'`, per-route `prerender = false` |
| P0-10 | WCAG/ADA failures | axe-core in CI from Phase 1 |

---

## 5. Open Questions Requiring Scott's Input

| # | Question | Default if not answered |
|---|----------|------------------------|
| Q1 | Public street address (residential / registered agent / P.O. box)? | Ship `addressLocality: "Annandale"` + `addressRegion: "NJ"` only |
| Q2 | Publish a phone number or contact-form-only? | No phone; CTA = form |
| Q3 | Contact form provider: Resend-only / Supabase+Resend / Formspree? | Present options at contact phase |
| Q4 | Calendar scheduler (Calendly/SavvyCal) — embed on contact + bio? | No scheduler v1; all CTAs → `/contact` |
| Q5 | Testimonials — any attributed or anonymized quotes available? | Defer; rely on prior-employer logos |
| Q6 | Confirm "starting at $4,500/month" public anchor? | Ship anchor; revisit with conversion data |
| Q7 | Tagline — replace "Business Focused Legal Support"? | Ship interim placeholder; flag for approval |
| Q8 | NJ + MD state-specific attorney-advertising disclaimer wording? | Ship safe-baseline ABA 7.1/7.2; refine before launch |

---

## 6. Confidence

| Area | Level |
|------|-------|
| Astro 6 / Tailwind v4 / Vercel / Resend patterns | HIGH |
| Site architecture, URLs, layouts | HIGH |
| Features, StoryBrand, ABA 477R | HIGH |
| Pitfalls (Astro + ABA + ADA) | HIGH |
| State-bar specifics (MD + NJ) | MEDIUM — needs pre-launch review |
| Contact form provider selection | LOW (deliberately deferred) |
