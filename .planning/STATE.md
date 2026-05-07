---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 1
status: ready_to_plan
last_updated: "2026-05-07T18:31:50.173Z"
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 5
  completed_plans: 0
  percent: 25
---

# Project State — Scopal Firm Website

**Status:** Ready to plan
**Current Phase:** 2
**Last Updated:** 2026-05-07

## Project Reference

See: .planning/PROJECT.md
**Core value:** A SaaS founder lands on the site, immediately recognizes their situation, and gets in touch.
**Phases:** 4 total

## Phase Summary

| # | Phase | Status | Requirements |
|---|-------|--------|--------------|
| 1 | Foundation + Live Skeleton | Not started | FOUND-01..07 (7) |
| 2 | Homepage + Conversion Spine | Not started | HOME-01..07 (7) |
| 3 | Firm Substance — People, Practice Areas, Pricing | Not started | PRAC-01..05, TEAM-01..04, PRICE-01..03 (12) |
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
**Todos:** None active until Phase 1 planning starts.
**Blockers:** None.

## Session Continuity

- Next action: `/gsd-plan-phase 1`
- Working directory: `/Users/spalmer/Documents/Claude Code/Scopal Website`
- Repo: https://github.com/spalmer47/scopal
- Read on session start (per `.claude/CLAUDE.md`): `.planning/FIRM_BRIEF.md`, `.planning/LAW_FIRM_WEBSITE_GUIDE.md`.

## Notes

- User is a practicing attorney with no coding background — explain commands and concepts in plain English before running them.
- Tech stack (Astro 6 + Tailwind v4 + GitHub + Vercel) is non-negotiable.
- ABA Formal Opinion 477R applies to the contact form and any lead storage.
- ADA/WCAG 2.1 AA from day one — axe-core in CI from Phase 1.
