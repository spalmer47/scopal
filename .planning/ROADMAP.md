# Roadmap: Scopal Firm Website

**4 phases** | **47 v1 requirements** | Coarse granularity | MVP mode

A SaaS founder lands on the site, recognizes their situation, and gets in touch. Each phase below ships a visibly meaningful slice toward that outcome — Phase 1 puts a real (if minimal) site live on Vercel; each subsequent phase widens what a visitor can see, read, and do.

---

## Phases

- [x] **Phase 1: Foundation + Live Skeleton** — Astro 6 / Tailwind v4 / Vercel deploy with security headers, CI guardrails, layouts, constants, and a placeholder homepage live at scopalfirm.com (completed 2026-05-07)
- [x] **Phase 2: Homepage + Conversion Spine** — StoryBrand homepage, persistent CTA, trust strip, and the "proactive vs reactive" insight that makes a SaaS founder say "this is for me" (completed 2026-05-07)
- [x] **Phase 3: Firm Substance — People, Practice Areas, Pricing** — Three practice area pages, Scott's attorney bio, Rachel's team page, and the pricing/engagement model page (completed 2026-05-07)
- [ ] **Phase 4: Lead Capture + Content + Launch Hardening** — Contact form (with ABA 477R + 7 server controls), blog system with one published post, full SEO/legal/security/performance hardening for public launch

---

## Phase Details

### Phase 1: Foundation + Live Skeleton
**Goal:** Stand up a deployable Astro 6 + Tailwind v4 site on Vercel with all compliance/security/CI rails wired so every later phase inherits them for free.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07
**Success Criteria** (what must be TRUE):
  1. Visiting `https://scopalfirm.com` returns a live Astro-rendered placeholder homepage served by Vercel, auto-deployed on push to `main`.
  2. A response-header check on the live site shows CSP, X-Frame-Options=DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS (`max-age=63072000; includeSubDomains; preload`) on every route.
  3. CI runs on every PR and blocks merge on any of: banned-words lint hit, axe-core a11y violation, broken internal link, gitleaks secret detection, or Lighthouse performance budget breach.
  4. A page rendered through `BaseLayout` automatically shows the firm footer (NAP, attorney advertising line, jurisdictional UPL disclaimer) without the page author writing any disclaimer code.
  5. `src/lib/constants.ts`, `content.config.ts` (with `blog`, `practiceAreas`, `team` Zod schemas), and `.env.example` exist and are the single source of truth for firm data, content shape, and required env vars.
**Plans:** 5/5 plans complete
Plans:
**Wave 1**
- [x] 01-01-PLAN.md — Bootstrap Astro 6 + Tailwind v4 + Vercel adapter; placeholder homepage builds locally

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02-PLAN.md — Compliance core: constants.ts + BaseLayout/MarketingLayout + Header/Footer/FooterDisclaimer + SEO/LegalServiceSchema; placeholder homepage renders with disclaimers + JSON-LD
- [x] 01-03-PLAN.md — Security headers (vercel.json), secret hygiene (.gitignore + .env.example), content collections (content.config.ts + empty folders), robots.txt

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 01-04-PLAN.md — CI merge gate (.github/workflows/ci.yml + scripts/banned-words.mjs + .lighthouserc.json) running banned-words / axe-core / linkinator / gitleaks / Lighthouse

**Wave 4** *(blocked on Wave 3 completion)*
- [x] 01-05-PLAN.md — Push to GitHub, link Vercel project, DNS cutover for scopalfirm.com, verify all six security headers live; deploy notes + follow-up TODOs
**UI hint:** yes

### Phase 2: Homepage + Conversion Spine
**Goal:** Ship the StoryBrand homepage that converts a SaaS founder in the first viewport — client problem first, proactive-vs-reactive insight, persistent CTA, trust strip, JSON-LD.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07
**Success Criteria** (what must be TRUE):
  1. A visitor sees a hero that names the SaaS-founder problem (not firm history or credentials) within the first viewport on mobile.
  2. The homepage flows through StoryBrand beats in order — hero → problem → guide → 3-step plan → stakes → success → CTA — and the "proactive legal is cheaper than reactive" insight appears in the first two sections.
  3. A "Schedule a Consultation" / "Book a Fit Call" CTA is reachable from the top, middle, and bottom of the homepage; the strings "Contact Us" and "Free Consultation" never appear.
  4. The trust strip in the first viewport displays prior in-house employer marks (uPerform, Ancile Solutions), bar admissions, and association affiliations (HeyCounsel, InHoused) — no client logo wall.
  5. Google Rich Results Test validates `LegalService` (with `areaServed: US`) and `WebSite` (with `SearchAction`) JSON-LD on `/`, and Lighthouse mobile scores ≥ 90 with LCP < 2.0s and CLS < 0.05.
**Plans:** 2 plans
Plans:
**Wave 1**
- [x] 02-01-PLAN.md — Update Header.astro (nav links, "Book a Fit Call" CTA, mobile hamburger); create placeholder /contact page

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 02-02-PLAN.md — WebSiteSchema.astro + BaseLayout patch + all 7 homepage section components + full index.astro replacement
**UI hint:** yes

### Phase 3: Firm Substance — People, Practice Areas, Pricing
**Goal:** Give a convinced visitor every page they need to qualify the firm — who Scott is, what the firm does, who's on the team, and what engagement looks like.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** PRAC-01, PRAC-02, PRAC-03, PRAC-04, PRAC-05, TEAM-01, TEAM-02, TEAM-03, TEAM-04, PRICE-01, PRICE-02, PRICE-03
**Success Criteria** (what must be TRUE):
  1. A visitor can reach `/practice-areas/fractional-general-counsel`, `/practice-areas/corporate-law`, and `/coaching`, each 800–1,500+ words with H1 describing the client's situation, who-it's-for, scenarios, engagement, scope/pricing, FAQ (3–5 on practice area pages), and CTA. (Note: /coaching is a separate top-level page per D-01, not under /practice-areas/.)
  2. Every practice area page automatically renders the attorney-client disclaimer callout, FAQ block (emitting `FAQPage` schema), breadcrumbs, and CTASection without the page author wiring them.
  3. `/attorneys/scott-palmer` displays Scott's bio leading with client benefit, prior in-house roles, education, representative matters, headshot, and bar status copy reading exactly "Maryland (2009); New Jersey admission pending" — no copy implies NJ is active.
  4. `/team/rachel-palmer` exists under `/team/` (NOT `/attorneys/`), clearly identifies Rachel's non-attorney role, and shows her headshot.
  5. `/pricing` anchors "Unlimited GC Access" at $995/month, contextualizes value vs BigLaw hourly and full-time GC hire cost, and CTAs read "Book a Fit Call" / "Schedule a Consultation" — never "Buy Now" or "Sign Up". Practice area + bio JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`, `Person` with `worksFor`/`alumniOf`/`hasCredential`) passes Google Rich Results Test.
**Plans:** 5 plans
Plans:
**Wave 0** *(blocking checkpoint — Rachel's headshot must be committed before Wave 1)*
- [x] 03-00-PLAN.md — Headshot prerequisite: Scott's headshot 296 KB → 44 KB (commit 62629f6); Rachel placeholder committed (commit c189abc)

**Wave 1a**
- [x] 03-01-PLAN.md — Infrastructure: coaching collection (content.config.ts), 4 schema components (FAQSchema, BreadcrumbSchema, PersonSchema, ServiceSchema), DisclaimerCallout, PracticeAreaLayout, Header dropdown + Coaching nav link (commit 57dd69e)

**Wave 1b** *(blocked on Wave 1a — 03-02 depends on PracticeAreaLayout from 03-01)*
- [x] 03-02-PLAN.md — Practice area content: [slug].astro dynamic routing template + corporate-law.mdx + fractional-general-counsel.mdx (800–1,500+ words each, 3–5 FAQs each); fix: moved content.config.ts from root to src/ (commit 23e8890)

**Wave 2** *(parallel — no file conflicts between 03-03 and 03-04)*
- [x] 03-03-PLAN.md — Static pages: coaching.astro (renders coaching MDX via collection) + pricing.astro (Unlimited GC Access, $995/month, 5 service area cards, comparison context) (commit e21e6b3)
- [x] 03-04-PLAN.md — Bio pages: scott-palmer.astro (PersonSchema, formatBarStatus(), astro:assets headshot, client-benefit H1) + rachel-palmer.astro (Head of Operations, /team/ URL, no attorney schema) (commit e21e6b3)
**UI hint:** yes

### Phase 4: Lead Capture + Content + Launch Hardening
**Goal:** Turn the site into a working lead engine — secure ABA 477R-compliant contact form, live blog with first post, and the SEO / legal / security / performance hardening required for a real public launch.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, LEGAL-01, LEGAL-02, LEGAL-03, LEGAL-04, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. A visitor can submit the `/contact` form (name, email, company, brief description) — the ABA 477R disclaimer renders ABOVE the submit button, the form degrades to a working HTML POST without JavaScript, and a successful submission shows a confirmation page restating no-attorney-client-relationship and the 2-business-day response window; Scott receives the email via the chosen provider.
  2. The contact endpoint enforces all 7 server-side controls — Origin/CSRF check, honeypot, IP rate limit (≤5/hour), Zod re-validation, HTML-escaped body, CRLF rejection in header-bound fields, and fixed `From:`/`Subject:` headers — verified by an adversarial test pass.
  3. `/blog/` lists posts with pagination, `/blog/[slug]` renders MDX with auto-injected disclaimer + `Article` JSON-LD + breadcrumbs + CTA, drafts are filtered from production, `/rss.xml` validates, and at least one real post by Scott A. Palmer is published at launch.
  4. Every page is covered by the `<SEO />` component (≤60-char title in the `${pageTitle} — Annandale, NJ | Scopal Firm` format, ≤155-char description, canonical, OG image, JSON-LD); `sitemap.xml` auto-generates, `robots.txt` allows crawlers + disallows `/api/`, and `/legal/disclaimer`, `/legal/privacy`, `/legal/terms`, `/legal/accessibility-statement` are published.
  5. A pre-launch audit passes: `dist/` contains no leaked credentials, all secrets live only in Vercel env vars, RLS is on if Supabase is used, `<Testimonial>`/`<CaseResult>` won't build without a `disclaimer` prop, all images route through `astro:assets` with committed sources ≤200 KB and self-hosted fonts (max 2 families × 2 weights, above-fold preloaded, `font-display: swap`), and Lighthouse mobile ≥ 90 with LCP < 2.0s, CLS < 0.05, INP < 100ms across all page types.
**Plans:** TBD
**UI hint:** yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Live Skeleton | 5/5 | Complete    | 2026-05-07 |
| 2. Homepage + Conversion Spine | 2/2 | Complete    | 2026-05-07 |
| 3. Firm Substance — People, Practice Areas, Pricing | 5/5 | Complete | 2026-05-07 |
| 4. Lead Capture + Content + Launch Hardening | 0/0 | Not started | — |

---

## Coverage

- v1 requirements: **47**
- Mapped to phases: **47**
- Unmapped: **0** ✓

| Group | Count | Phase |
|-------|-------|-------|
| FOUND-01..07 | 7 | Phase 1 |
| HOME-01..07 | 7 | Phase 2 |
| PRAC-01..05 | 5 | Phase 3 |
| TEAM-01..04 | 4 | Phase 3 |
| PRICE-01..03 | 3 | Phase 3 |
| FORM-01..06 | 6 | Phase 4 |
| BLOG-01..05 | 5 | Phase 4 |
| SEO-01..05 | 5 | Phase 4 |
| LEGAL-01..04 | 4 | Phase 4 |
| SEC-01..05 | 5 | Phase 4 |
| PERF-01..03 | 3 | Phase 4 |
| **Total** | **47** | — |

---
*Roadmap created: 2026-05-07 from PROJECT.md + REQUIREMENTS.md + research/SUMMARY.md*
*Phase 3 plans added: 2026-05-07*
