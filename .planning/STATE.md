---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 4
status: ready_to_execute
last_updated: "2026-05-08T00:00:00.000Z"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 17
  completed_plans: 14
  percent: 82
---

# Project State — Scopal Firm Website

**Status:** Phase 4 in progress — 04-00, 04-02, 04-03 complete
**Current Phase:** 4
**Last Updated:** 2026-05-08

## Project Reference

See: .planning/PROJECT.md
**Core value:** A SaaS founder lands on the site, immediately recognizes their situation, and gets in touch.
**Phases:** 4 total

## Phase Summary

| # | Phase | Status | Requirements |
|---|-------|--------|--------------|
| 1 | Foundation + Live Skeleton | Complete | FOUND-01..07 (7) |
| 2 | Homepage + Conversion Spine | Complete (2/2 plans done) | HOME-01..07 (7) |
| 3 | Firm Substance — People, Practice Areas, Pricing | Complete (5/5 plans done) | PRAC-01..05, TEAM-01..04, PRICE-01..03 (12) |
| 4 | Lead Capture + Content + Launch Hardening | Not started | FORM-01..06, BLOG-01..05, SEO-01..05, LEGAL-01..04, SEC-01..05, PERF-01..03 (28) |

**Coverage:** 47 / 47 v1 requirements mapped ✓

## Open Questions (from research)

- **Q1:** Public street address for NAP (residential / registered agent / P.O. box)? — *Default if unanswered: ship `addressLocality: "Annandale"` + `addressRegion: "NJ"` only.*
- **Q2:** Publish phone number or contact-form-only? — *Default: no phone; CTA = form.*
- **Q3:** Contact form provider: Resend-only / Supabase+Resend / Formspree? — *Decide at Phase 4 contact-form planning.*
- **Q4:** Calendar scheduler embed (Calendly/SavvyCal) on contact + bio? — *Default: no scheduler v1; all CTAs → `/contact`.*
- **Q5:** Testimonials — any attributed or anonymized quotes available? — *Default: defer; rely on prior-employer logos.*
- **Q6:** Confirm "starting at $4,500/month" public anchor? — *Default: ship anchor; revisit with conversion data.*
- **Q7:** Tagline — replace "Business Focused Legal Support"? — *Default: ship interim placeholder; flag for approval.*
- **Q8:** MD + NJ state-specific attorney-advertising disclaimer wording? — *Default: ship safe-baseline ABA 7.1/7.2; refine before launch.*

## Key Decisions (from research/SUMMARY.md)

- **D1:** Astro 6 (`^6.3`) `output: 'static'` — `prerender = false` only on contact endpoint.
- **D2:** Tailwind CSS v4 via `@tailwindcss/vite`; CSS-first config in `src/styles/global.css`. No `tailwind.config.js`. `@astrojs/tailwind` is deprecated.
- **D3:** `@astrojs/vercel` adapter with `webAnalytics.enabled: true`, `imageService: true`, region `iad1`.
- **D4:** Contact form = Astro Actions + Zod + Resend (server-side); provider TBD per Scott's intake workflow (Resend default; Supabase optional).
- **D5:** Content collections via Astro 6 `glob` loader at `content.config.ts`: `blog`, `practiceAreas`, `team`.
- **D6:** URLs: `/practice-areas/[slug]`, `/attorneys/[slug]` (licensed only), `/team/[slug]` (non-attorneys); kebab-case, no trailing slashes.
- **D7:** Layout hierarchy `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`. Disclaimers enforced by layouts, not page authors.
- **D8:** JSON-LD: `LegalService` on `/` and `/about` only; `Person` on bios (NOT deprecated `Attorney`); `Service`+`FAQPage`+`BreadcrumbList` on practice areas; `Article`+`BreadcrumbList` on blog posts.
- **D9:** NAP: `areaServed: Country=US`. Match exactly across footer / JSON-LD / GBP / directories.
- **D10:** Self-host fonts (woff2) in `public/fonts/`. No Google Fonts. Max 2 families × 2 weights. Preload above-fold weight; `font-display: swap`.
- **D11:** All images via `astro:assets` `<Image />`. Hero `loading="eager"` + `fetchpriority="high"`. 200 KB committed-source ceiling.
- **D12:** Zero JS by default. Mobile menu + form = vanilla `<script>`. No React/Vue islands in v1.
- **D13:** `vercel.json` ships security headers from day one (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS).
- **D14:** Banned vocabulary: "specialist," "specializing in," "expert," "the best," "#1," "leading," "top-rated." Permitted: "focuses on," "represents clients in," "experienced in." CI-enforced.
- **D15:** Single source of truth for NAP, bar admissions, social URLs: `src/lib/constants.ts`.
- **D16:** Pricing anchor "starting at $4,500/month" public; CTA "Book a fit call" / "Schedule a Consultation." Never "Free Consultation."
- **D17:** Bar status copy: "Maryland (2009); New Jersey admission pending." Schema `barAdmissions[].status: 'active'|'pending'`. Site copy must never imply NJ active.

## Performance Metrics

- Lighthouse mobile ≥ 90 (all page types at launch)
- LCP < 2.0s
- CLS < 0.05
- INP < 100ms
- Committed image source ceiling: 200 KB

## Accumulated Context

**Decisions:** See "Key Decisions" above (D1–D17). Log new ones in `.planning/DECISIONS.md` per `.claude/CLAUDE.md`.
**Todos:** None active.
**Blockers:** None active. (Logo files confirmed present in `public/images/logos/` before 02-01 executed.)

## Phase 2 Planning Summary (2026-05-07)

- **02-01-PLAN.md** (Wave 1) — Header nav update + `/contact` placeholder. `autonomous: false` — logo checkpoint blocks execution until Scott commits logo files.
- **02-02-PLAN.md** (Wave 2, depends on 02-01) — Full StoryBrand homepage: 7 section components + WebSiteSchema + BaseLayout patch + `index.astro` replacement. `autonomous: true`.

## Phase 3 Planning Summary (2026-05-07)

- **03-00-PLAN.md** (Wave 0, autonomous: false) — Headshot prerequisites: optimize Scott's headshot (296 KB → ≤200 KB, src/assets/team/); blocking human checkpoint for Rachel's headshot commit.
- **03-01-PLAN.md** (Wave 1a, autonomous: true) — Infrastructure: coaching collection (content.config.ts), 4 schema components (FAQSchema, BreadcrumbSchema, PersonSchema, ServiceSchema), DisclaimerCallout, PracticeAreaLayout, Header dropdown + Coaching nav link.
- **03-02-PLAN.md** (Wave 1b, depends on 03-01, autonomous: true) — Practice area content: [slug].astro dynamic routing template + corporate-law.mdx + fractional-general-counsel.mdx (800–1,500+ words each, 3–5 FAQs each). Uses entry.id per Astro 6 breaking change.
- **03-03-PLAN.md** (Wave 2, autonomous: true) — Static pages: coaching.astro (renders coaching MDX via collection, audience: in-house attorneys/GCs) + pricing.astro (Unlimited GC Access, $995/month, 5 service area cards, StoryBrand narrative, comparison context).
- **03-04-PLAN.md** (Wave 2, autonomous: true) — Bio pages: scott-palmer.astro (PersonSchema, formatBarStatus(), astro:assets headshot, client-benefit H1) + rachel-palmer.astro (Head of Operations, /team/ URL, UPL-compliant non-attorney copy).

## Session Continuity

- Phase 4 / 04-03 complete: 2026-05-08 — Contact form (Resend, Option A), ABA 477R, all 7 FORM-03 controls, thank-you page; commit 7845bd3
- Phase 4 / 04-02 complete: 2026-05-08 — SEO upgrade (absolute og:image, twitter:card), 4 legal pages, Footer legal links; commit e8932fe
- Phase 4 / 04-00 complete: 2026-05-08 — fonts, OG image, legal components, first blog post; commit 7895a49
- Phase 3 complete: 2026-05-07 — 5 plans, 8 pages built, all passing
- Working directory: `/Users/spalmer/Documents/Claude Code/Scopal Website`
- Repo: https://github.com/spalmer47/scopal
- Read on session start (per `.claude/CLAUDE.md`): `.planning/FIRM_BRIEF.md`, `.planning/LAW_FIRM_WEBSITE_GUIDE.md`.
- Key fix: content.config.ts moved from repo root to src/ (Astro 6 searches srcDir, not root)
- Key fix: getCollection uses camelCase key ('practiceAreas', 'coaching') not kebab-case
- Rachel Palmer headshot is a gray placeholder — replace with real photo before launch
- Phase 4 planning: run `/gsd-plan-phase 4` when ready to proceed

## Phase 3 Commits

| Commit | Plan | Description |
|--------|------|-------------|
| c189abc | 03-00 | Rachel placeholder headshot |
| 57dd69e | 03-01 | Schema components, PracticeAreaLayout, Header dropdown |
| 23e8890 | 03-02 | Practice area pages + content.config.ts path fix |
| e21e6b3 | 03-03+04 | Coaching, pricing, bio, and team pages |

## Notes

- User is a practicing attorney with no coding background — explain commands and concepts in plain English before running them.
- Tech stack (Astro 6 + Tailwind v4 + GitHub + Vercel) is non-negotiable.
- ABA Formal Opinion 477R applies to the contact form and any lead storage.
- ADA/WCAG 2.1 AA from day one — axe-core in CI from Phase 1.
