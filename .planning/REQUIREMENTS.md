# Requirements: Scopal Firm Website

**Defined:** 2026-05-07
**Core Value:** A SaaS founder lands on the site, immediately recognizes their situation, understands the value of a dedicated legal partner vs. reactive law firm billing, and gets in touch.

---

## v1 Requirements

### Foundation & Infrastructure

- [x] **FOUND-01**: Astro 6 project scaffolded with Tailwind CSS v4 (`@tailwindcss/vite`) and `@astrojs/vercel` adapter, deployed to Vercel with auto-deploy on push to main
- [x] **FOUND-02**: `vercel.json` ships security headers on every response: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- [x] **FOUND-03**: `.env` and `.env.local` excluded from git; `.env.example` documents all required vars; gitleaks runs in CI to prevent secret commits
- [x] **FOUND-04**: `src/lib/constants.ts` is the single source of truth for firm NAP, bar admissions, and social URLs — consumed by JSON-LD, footer, and contact confirmation
- [x] **FOUND-05**: CI pipeline runs from Phase 1: banned-words lint, axe-core accessibility check, link checker, Lighthouse CI with performance budgets
- [x] **FOUND-06**: Content collections defined in `content.config.ts` for `blog`, `practiceAreas`, and `team` with Zod frontmatter schemas
- [x] **FOUND-07**: Layout hierarchy enforces compliance: `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`; disclaimers injected by layouts, not page authors

### Homepage

- [ ] **HOME-01**: Homepage hero leads with client problem ("We are the in-house legal team for SaaS companies that aren't ready to hire one yet" — or equivalent) — NOT firm history or credentials
- [ ] **HOME-02**: Homepage follows StoryBrand structure: hero → problem agitation → firm-as-guide → 3-step plan → stakes → success vision → CTA
- [ ] **HOME-03**: "Proactive legal support is cheaper than reactive" insight appears in first two homepage sections, with clear explanation of how the subscription model works
- [ ] **HOME-04**: Trust strip in first viewport: prior in-house employer logos (uPerform, Ancile Solutions) + bar admissions + professional associations (HeyCounsel, InHoused)
- [ ] **HOME-05**: Persistent CTA ("Schedule a Consultation" or "Book a Fit Call") appears at top, mid-page, and bottom of homepage — never "Contact Us" or "Free Consultation"
- [ ] **HOME-06**: Homepage JSON-LD includes `LegalService` (with `areaServed: US`) and `WebSite` with `SearchAction`
- [ ] **HOME-07**: Homepage passes Lighthouse mobile score ≥ 90; LCP < 2.0s; CLS < 0.05

### Practice Area Pages

- [ ] **PRAC-01**: Three dedicated practice area pages at `/practice-areas/fractional-general-counsel`, `/practice-areas/corporate-law`, and `/practice-areas/legal-executive-coaching`
- [ ] **PRAC-02**: Each practice area page is 800–1,500+ words with H1 that is client-focused (describes the client's situation, not the firm's service name)
- [ ] **PRAC-03**: Each practice area page includes: who-it's-for, common client scenarios, how engagement works, scope/pricing orientation, FAQ block (3–5 questions), CTA, internal link to attorney bio
- [ ] **PRAC-04**: `PracticeAreaLayout` auto-injects attorney-client disclaimer callout, FAQ component (emits `FAQPage` schema), breadcrumbs, and CTASection on every practice area page
- [ ] **PRAC-05**: Practice area JSON-LD includes `Service`, `FAQPage`, and `BreadcrumbList`; validated with Google Rich Results Test before merge

### Attorney & Team Pages

- [ ] **TEAM-01**: Scott A. Palmer attorney bio at `/attorneys/scott-palmer`; leads with client benefit, includes prior in-house roles, bar admissions (MD active 2009; NJ pending), education, representative matters, professional associations, headshot, direct CTA
- [ ] **TEAM-02**: Rachel Palmer staff page at `/team/rachel-palmer` (NOT `/attorneys/`) — clearly titled non-attorney role; includes headshot and role description
- [ ] **TEAM-03**: Attorney bio JSON-LD uses `Person` schema (NOT deprecated `Attorney` type) with `worksFor`, `alumniOf`, `hasCredential`
- [ ] **TEAM-04**: Bar admission status copy reads: "Maryland (2009); New Jersey admission pending" — no copy implies NJ admission is active

### Contact Form

- [ ] **FORM-01**: Contact form collects: name, email, company name, brief description of need — no sensitive matter details (conflict-check risk)
- [ ] **FORM-02**: ABA Formal Opinion 477R disclaimer appears ABOVE the submit button (not footer): "Submitting this form does not create an attorney-client relationship. Do not send confidential or time-sensitive information."
- [ ] **FORM-03**: Form has seven mandatory server-side controls: Origin/CSRF check, honeypot field, IP rate limit (≤5 submissions/hour per IP), Zod re-validation, HTML-escaped body, CRLF rejection in header-bound fields, fixed `From:`/`Subject:` headers
- [ ] **FORM-04**: HTML form fallback works without JavaScript (Astro Action degrades gracefully for accessibility)
- [ ] **FORM-05**: Form submission sends email notification to Scott via chosen provider (Resend, Supabase+Resend, or Formspree — decided at contact phase)
- [ ] **FORM-06**: Successful submission shows confirmation page with: thank-you message, expected response time ("within 2 business days"), restatement of no-attorney-client-relationship

### Pricing / Engagement Model Page

- [ ] **PRICE-01**: `/pricing` page presents subscription anchor "starting at $4,500/month" and flat-fee project option — framed as "engagement models," not a pricing menu
- [ ] **PRICE-02**: Pricing page includes comparison context anchoring value against BigLaw hourly rates and full-time GC hire cost
- [ ] **PRICE-03**: Pricing page CTA is "Book a Fit Call" / "Schedule a Consultation" — never "Buy Now" or "Sign Up"

### Blog / Insights

- [ ] **BLOG-01**: Blog index at `/blog/` (paginated) and individual posts at `/blog/[slug]` using MDX content collection
- [ ] **BLOG-02**: Every blog post is attributed to Scott A. Palmer; `BlogPostLayout` auto-injects prose wrapper, legal disclaimer, `Article` JSON-LD, breadcrumbs, and CTA
- [ ] **BLOG-03**: Blog posts can be drafted (filtered from production via `draft: true` frontmatter)
- [ ] **BLOG-04**: RSS feed at `/rss.xml`
- [x] **BLOG-05**: At least 1 published blog post ships with the initial site to demonstrate the blog is active

### SEO & Metadata

- [ ] **SEO-01**: `<SEO />` component in `BaseLayout.astro` handles title (≤60 chars, format: `${pageTitle} — Annandale, NJ | Scopal Firm`), description (≤155 chars), canonical, Open Graph, and JSON-LD for every page
- [ ] **SEO-02**: `@astrojs/sitemap` generates `sitemap.xml` automatically; `public/robots.txt` allows all crawlers and references sitemap; `/api/*` disallowed
- [x] **SEO-03**: Default Open Graph image (`/og-default.jpg`, 1200×630) in `public/`; per-page OG image override available via frontmatter
- [ ] **SEO-04**: JSON-LD components (`LegalServiceSchema`, `PersonSchema`, `ArticleSchema`, `FAQSchema`, `BreadcrumbSchema`) wrap raw objects — no free-form JSON-LD strings in page files
- [ ] **SEO-05**: Every page type validated with Google Rich Results Test before merge

### Legal Compliance & Disclaimers

- [ ] **LEGAL-01**: Footer on every page (via `BaseLayout`): NAP, attorney advertising statement ("Attorney Advertising. Prior results do not guarantee a similar outcome."), responsible attorney (Scott A. Palmer), jurisdictions (MD active; NJ pending), no-attorney-client disclaimer, privacy/terms links
- [ ] **LEGAL-02**: Jurisdictional UPL disclaimer in footer: "Scopal Firm, LLC attorneys are licensed to practice law in Maryland; New Jersey admission pending. This website is not intended to solicit clients in jurisdictions where the firm's attorneys are not licensed."
- [ ] **LEGAL-03**: `/legal/disclaimer`, `/legal/privacy`, `/legal/terms`, and `/legal/accessibility-statement` pages published at launch
- [x] **LEGAL-04**: `<Testimonial>` and `<CaseResult>` components require a `disclaimer` prop — cannot be rendered without one (build-time enforcement)

### Security Hardening

- [ ] **SEC-01**: `vercel.json` security headers verified in production: CSP blocks inline scripts and external origins; X-Frame-Options=DENY; HSTS `max-age=63072000; includeSubDomains; preload`
- [ ] **SEC-02**: `dist/` build output audited for exposed API keys or credentials before any public launch
- [ ] **SEC-03**: All API keys stored as Vercel environment variables only; never appear in source files, build output, or git history
- [ ] **SEC-04**: If Supabase is chosen for lead storage: Row Level Security enabled on all tables
- [ ] **SEC-05**: Pre-launch security audit passes (HTTP headers, secrets, form validation, spam protection, RLS if applicable)

### Performance

- [ ] **PERF-01**: All images routed through `astro:assets` `<Image />`; committed source images ≤200 KB; WebP/AVIF output for hero via `<Picture />`
- [x] **PERF-02**: Fonts self-hosted in `public/fonts/` (no Google Fonts); max 2 families × 2 weights; above-fold weight preloaded; `font-display: swap`
- [ ] **PERF-03**: Site passes Lighthouse mobile ≥ 90 across all page types at launch; LCP < 2.0s; CLS < 0.05; INP < 100ms

---

## v2 Requirements (Deferred)

### Social Proof
- Attributed or anonymized client testimonials (pending Scott's confirmation that prior clients will provide quotes)
- Speaking / media appearances page

### Inbound Engine
- Newsletter signup / email capture
- Downloadable resources (contract templates, legal guides)

### Enhanced Contact
- Calendar scheduler embed (Calendly / SavvyCal) on contact page and attorney bio

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Client portal / authenticated area | Not needed for a fractional GC marketing site; no secure document exchange in v1 |
| Headless CMS | Astro content collections handle all content; adding CMS layer adds complexity without benefit for a solo practice |
| Multi-language support | English only; audience is US SaaS companies |
| E-commerce / payment processing | Inquiry-based engagement model; no transactional checkout |
| Live chat | ADA/WCAG overhead, potential UPL risk for solo practice, and confidentiality concerns before conflict check |
| Client logo wall | Most in-house clients cannot be publicly identified; confidentiality obligation |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| HOME-05 | Phase 2 | Pending |
| HOME-06 | Phase 2 | Pending |
| HOME-07 | Phase 2 | Pending |
| PRAC-01 | Phase 3 | Pending |
| PRAC-02 | Phase 3 | Pending |
| PRAC-03 | Phase 3 | Pending |
| PRAC-04 | Phase 3 | Pending |
| PRAC-05 | Phase 3 | Pending |
| TEAM-01 | Phase 3 | Pending |
| TEAM-02 | Phase 3 | Pending |
| TEAM-03 | Phase 3 | Pending |
| TEAM-04 | Phase 3 | Pending |
| PRICE-01 | Phase 3 | Pending |
| PRICE-02 | Phase 3 | Pending |
| PRICE-03 | Phase 3 | Pending |
| FORM-01 | Phase 4 | Pending |
| FORM-02 | Phase 4 | Pending |
| FORM-03 | Phase 4 | Pending |
| FORM-04 | Phase 4 | Pending |
| FORM-05 | Phase 4 | Pending |
| FORM-06 | Phase 4 | Pending |
| BLOG-01 | Phase 4 | Pending |
| BLOG-02 | Phase 4 | Pending |
| BLOG-03 | Phase 4 | Pending |
| BLOG-04 | Phase 4 | Pending |
| BLOG-05 | Phase 4 | Complete |
| SEO-01 | Phase 4 | Pending |
| SEO-02 | Phase 4 | Pending |
| SEO-03 | Phase 4 | Complete |
| SEO-04 | Phase 4 | Pending |
| SEO-05 | Phase 4 | Pending |
| LEGAL-01 | Phase 4 | Pending |
| LEGAL-02 | Phase 4 | Pending |
| LEGAL-03 | Phase 4 | Pending |
| LEGAL-04 | Phase 4 | Complete |
| SEC-01 | Phase 4 | Pending |
| SEC-02 | Phase 4 | Pending |
| SEC-03 | Phase 4 | Pending |
| SEC-04 | Phase 4 | Pending |
| SEC-05 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Complete |
| PERF-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-07 — traceability updated to 4-phase coarse-granularity roadmap*
