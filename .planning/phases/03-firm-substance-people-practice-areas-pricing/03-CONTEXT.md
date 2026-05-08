# Phase 3: Firm Substance — People, Practice Areas, Pricing — Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Give a convinced visitor every page they need to qualify the firm: two practice area pages (Corporate Law and Fractional GC), a dedicated `/coaching` page for Legal Executive Coaching, Scott's attorney bio, Rachel's staff page, and the pricing/engagement page.

**What this phase ships:**
- `src/content/practice-areas/` — MDX files for Corporate Law and Fractional GC
- `src/pages/practice-areas/[slug].astro` — dynamic routing template for practice area pages
- `src/content/coaching/` — MDX file for Legal Executive Coaching
- `src/pages/coaching.astro` (or `src/pages/coaching/index.astro`) — Legal Executive Coaching page
- `src/pages/attorneys/scott-palmer.astro` — Scott's attorney bio
- `src/pages/team/rachel-palmer.astro` — Rachel's staff page
- `src/pages/pricing.astro` — Pricing/engagement page
- Updated `src/components/layout/Header.astro` — Practice Areas dropdown + Coaching nav link
- New `PracticeAreaLayout.astro` — auto-injects disclaimer, FAQ block (FAQPage schema), breadcrumbs, CTASection
- `public/images/team/` — headshot images (Scott + Rachel, committed by Scott before execution)

**What this phase does NOT ship:**
- No `/practice-areas` index page — nav uses a dropdown instead
- No contact form (Phase 4)
- No blog system (Phase 4)
- No Legal Executive Coaching in the practice area collection — it lives at `/coaching`

</domain>

<decisions>
## Implementation Decisions

### Legal Executive Coaching — Classification & URL
- **D-01:** Legal Executive Coaching is NOT a practice area. It is a separate offering with its own page at `/coaching` — not under `/practice-areas/`.
- **D-02:** The `/coaching` page is built from an MDX content file (same pattern as practice areas), not a static `.astro` page. This keeps the content-editing workflow consistent.
- **D-03:** Legal Executive Coaching is for **in-house attorneys and GCs** — not the SaaS founder audience. The page H1 and opening copy speak to lawyers developing their leadership, executive presence, or career strategy.
- **D-04:** Coaching pricing/structure on the page is at Claude's discretion. Inquiry-based (CTA → "Book a Discovery Call") is the natural fit given the audience and that pricing wasn't specified. Scott reviews in UAT.

### Navigation Updates
- **D-05:** No `/practice-areas` index page. The Phase 2 Header "Practice Areas" link becomes a **dropdown menu** with two items: Corporate Law and Fractional GC (direct links to their individual pages).
- **D-06:** Coaching gets its **own separate nav link** at the top level, alongside Practice Areas, Scott Palmer, Pricing, and Book a Fit Call. Order: Practice Areas ▾ | Coaching | Scott Palmer | Pricing | Book a Fit Call.
- **D-07:** Mobile nav (hamburger) already uses vanilla `<script>`. Phase 3 extends it to handle the dropdown. No new JS libraries.

### Practice Area Pages
- **D-08:** Practice area pages use **MDX content files** with dynamic routing. Copy lives in `src/content/practice-areas/` as individual `.mdx` files. One `src/pages/practice-areas/[slug].astro` template renders all of them via `getCollection('practice-areas')`.
- **D-09:** Phase 3 practice areas are **Corporate Law** and **Fractional General Counsel** only. Legal Executive Coaching is excluded from this collection (see D-01).
- **D-10:** All practice area copy is **Claude-drafted** from `FIRM_BRIEF.md` and `LAW_FIRM_WEBSITE_GUIDE.md`. Scott reviews and approves during UAT. No copy provided by Scott in advance.
- **D-11:** Each practice area page is 800–1,500+ words. H1 is client-focused (describes the client's situation, not the firm's service name). Includes: who-it's-for, common client scenarios, how engagement works, scope/pricing orientation, FAQ block (3–5 questions), CTA, internal link to Scott's bio.
- **D-12:** `PracticeAreaLayout.astro` is a new layout created in Phase 3. It auto-injects: attorney-client disclaimer callout, FAQ component (emitting `FAQPage` schema), breadcrumbs (`BreadcrumbList` schema), and `CTASection`. Page authors do not wire these manually.

### Pricing Page
- **D-13:** Price anchor is **$995/month** — a single plan called **"Unlimited GC Access."** (This supersedes D16 from project decisions which stated $4,500/month.)
- **D-14:** The pricing model is: no hourly billing; unlimited day-to-day legal needs covered. Major discrete projects (M&A, complex transactions, litigation support, matters outside Scott's admitted jurisdictions) are scoped and billed separately — but this exclusion language does NOT appear as a bullet list on the pricing page.
- **D-15:** The pricing page **leads with "Unlimited GC Access"** as the headline — this is the primary conversion hook, not buried as a sub-point.
- **D-16:** Page structure: **StoryBrand narrative** — opens with client problem (unpredictable legal bills, no dedicated partner), reframes the subscription as prevention-vs-crisis, then presents the plan.
- **D-17:** The 5 included service areas are displayed as **feature cards / icon list** — each service area gets a card or icon+text block. The 5 service areas are:
  1. **Corporate** — Formation documents, partnership agreements, and related consulting
  2. **Contracts** — Initial audit, drafting and negotiation
  3. **HR Matters** — Daily HR questions, employment contracts
  4. **Pre-litigation** — Negotiation and dispute management
  5. **Data** — Audit, documentation, assessments, and agreements
- **D-18:** A **single note** appears on the pricing page stating that work outside the included scope will be estimated and billed separately. This is framed positively (not as an exclusion list).
- **D-19:** CTA on pricing page: "Book a Fit Call" (primary) and "Schedule a Consultation" (secondary) — never "Buy Now" or "Sign Up."
- **D-20:** Pricing page includes comparison context (value vs. BigLaw hourly rates and full-time GC hire cost) woven into the StoryBrand narrative — not as a separate table.

### Attorney Bio — Scott Palmer
- **D-21:** `/attorneys/scott-palmer` — leads with client benefit (what Scott does for you), then in-house background (7+ years as GC of PE-backed SaaS company), education, representative matters, bar admissions, professional associations, headshot, CTA.
- **D-22:** Bar status copy reads exactly: **"Maryland (2009); New Jersey admission pending"** — no copy implies NJ is active (carried forward from D17 in project decisions).
- **D-23:** JSON-LD uses `Person` schema (NOT deprecated `Attorney` type) with `worksFor`, `alumniOf`, `hasCredential` per D8 in project decisions.

### Team Page — Rachel Palmer
- **D-24:** `/team/rachel-palmer` — clearly titled with her non-attorney role (Head of Operations). Includes headshot and role description. Layout does NOT use `PracticeAreaLayout` or attorney-specific schema.
- **D-25:** Rachel's page must visually and textually make clear she is not an attorney (UPL compliance).

### Headshots
- **D-26:** Headshots are a **blocking prerequisite** — Scott commits them to `public/images/team/` before the execution agent runs. Same checkpoint pattern as Phase 2 logos.
- **D-27:** Scott may commit any image format. The execution plan includes an optimization step; final committed sources must be ≤200 KB and routed through `astro:assets` `<Image />`.
- **D-28:** Suggested filenames: `scott-palmer.jpg` (or `.webp`), `rachel-palmer.jpg` (or `.webp`).

### Claude's Discretion
- Exact copy for all page bodies — Claude drafts from `FIRM_BRIEF.md`; Scott reviews in UAT
- Legal Executive Coaching page format and pricing/CTA approach (inquiry-based recommended)
- Visual layout and Tailwind styling for all new pages and components — follows design system from `01-UI-SPEC.md`
- FAQ questions for each practice area (3–5 per page) — drafted from common client scenarios in `FIRM_BRIEF.md`
- Icon selection for the 5 pricing feature cards

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Firm Identity & Messaging
- `.planning/FIRM_BRIEF.md` — firm profile, team bios, client description, positioning, tone, design direction. Primary source for ALL copy in this phase.
- `.planning/LAW_FIRM_WEBSITE_GUIDE.md` — law firm website best practices: StoryBrand, ABA advertising rules, SEO/AEO, conversion patterns, disclaimer requirements.

### Phase Requirements & Success Criteria
- `.planning/ROADMAP.md` §Phase 3 — goal, 5 success criteria (PRAC-01..05, TEAM-01..04, PRICE-01..03), dependencies
- `.planning/REQUIREMENTS.md` §Practice Area Pages — PRAC-01 through PRAC-05
- `.planning/REQUIREMENTS.md` §Attorney & Team Pages — TEAM-01 through TEAM-04
- `.planning/REQUIREMENTS.md` §Pricing / Engagement Model Page — PRICE-01 through PRICE-03

> **Note:** PRICE-01 cites "$4,500/month" — this is superseded by D-13 in this CONTEXT.md. The correct anchor for Phase 3 is **$995/month**.

> **Note:** PRAC-01 lists `/practice-areas/legal-executive-coaching` as a third practice area URL — this is superseded by D-01 in this CONTEXT.md. Legal Executive Coaching lives at `/coaching` (not under `/practice-areas/`). See ROADMAP.md Phase 3 success criterion 1.

### Design System (locked in Phase 1)
- `.planning/phases/01-foundation-live-skeleton/01-UI-SPEC.md` — typography (Inter body / Fraunces display), spacing scale, color tokens, component patterns, container width. All Phase 3 pages inherit this system.
- `.planning/phases/01-foundation-live-skeleton/01-PATTERNS.md` — Astro component patterns, layout hierarchy, JSON-LD pattern, NAP single-source rule.

### Prior Phase Context
- `.planning/phases/02-homepage-conversion-spine/02-CONTEXT.md` — Phase 2 decisions; D-14 (nav structure), D-15 (nav links now going to Phase 3 pages), D-16 (CTA text variants), design pattern decisions.

### Source Files to Read Before Touching
- `src/styles/global.css` — `@theme {}` block: color tokens, font tokens
- `src/lib/constants.ts` — NAP, bar admissions, banned terms. All content referencing firm info reads from here.
- `src/layouts/BaseLayout.astro` — layout hierarchy; Footer + disclaimers auto-injected
- `src/layouts/MarketingLayout.astro` — wrapper used by existing pages; understand before creating `PracticeAreaLayout`
- `src/components/layout/Header.astro` — Phase 3 adds Practice Areas dropdown + Coaching link; read before modifying
- `src/components/seo/LegalServiceSchema.astro` — existing JSON-LD pattern to follow for new schema components
- `src/components/sections/CTASection.astro` — already exists; `PracticeAreaLayout` reuses this
- `content.config.ts` — existing `practiceAreas` and `team` Zod schemas; understand before adding MDX content files

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CTASection.astro` — already built in Phase 2; `PracticeAreaLayout` should import and render this automatically
- `MarketingLayout.astro` — model for building `PracticeAreaLayout`; understand its `BaseLayout` pass-through pattern
- `constants.ts` → `ATTORNEYS['scott-palmer']` + `formatBarStatus()` — use for bio page bar admission display
- `constants.ts` → `FIRM.email`, `FIRM.legalName` — use in all new page copy
- `global.css` `@theme` tokens — `brand-blue-500` for CTA backgrounds, `brand-orange-500` for accents only (never CTA or body text)
- Existing `BreadcrumbList`, `FAQPage` schema components (if created in earlier phases) — check before creating new ones

### Established Patterns
- **MDX + dynamic routing:** `getCollection('practice-areas')` in `[slug].astro` generates static paths at build time. Same pattern will work for coaching if routed through a collection.
- **JSON-LD via component:** New schema components (`ServiceSchema`, `FAQSchema`, `BreadcrumbSchema`, `PersonSchema`) must follow `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` pattern — never inline JSON-LD in page files.
- **NAP single-source rule:** Any firm data in new components reads from `constants.ts` — never hardcoded strings.
- **Disclaimer injection:** Disclaimers render automatically via `BaseLayout` → `Footer` → `FooterDisclaimer`. `PracticeAreaLayout` adds a *page-level* attorney-client disclaimer callout (separate from the footer disclaimer).
- **Banned words CI:** Copy must not contain: "specialist," "specializing in," "expert," "the best," "#1," "leading," "top-rated." Enforced by `scripts/banned-words.mjs` on every PR.
- **Astro Props interface:** Every new component with props defines `interface Props {}` in the frontmatter fence.
- **Zero JS by default:** Any interactive element (mobile dropdown) uses vanilla `<script>` only — no React/Vue islands.

### Integration Points
- `Header.astro` — modified to replace `/practice-areas` link with a dropdown (Corporate Law, Fractional GC) and add a Coaching link
- `PracticeAreaLayout.astro` — new file, used by `[slug].astro` for practice area pages
- `src/content/practice-areas/` — two new MDX files (corporate-law.mdx, fractional-general-counsel.mdx)
- `src/content/coaching/` or equivalent — one MDX file for Legal Executive Coaching
- `public/images/team/` — headshot images committed by Scott before execution

</code_context>

<specifics>
## Specific Ideas

- **Pricing headline:** "Unlimited GC Access" — exact headline string, decided by Scott
- **Pricing price point:** $995/month — exact figure, decided by Scott
- **5 included service areas:** Exact names and descriptions in D-17 above — do not rewrite these
- **Out-of-scope note:** A single line (not a list) noting that work outside the included scope will be estimated and billed separately
- **Legal Executive Coaching audience:** In-house attorneys and GCs — not the SaaS founder audience. Copy speaks to career development, leadership, executive presence
- **Nav order:** Practice Areas ▾ | Coaching | Scott Palmer | Pricing | Book a Fit Call
- **Headshot path:** `public/images/team/scott-palmer.[ext]` and `public/images/team/rachel-palmer.[ext]`
- **Visual reference:** newfangled.legal — retro-modern, approachable, personality-driven (carried forward from Phase 2)

</specifics>

<deferred>
## Deferred Ideas

- **Calendar scheduler embed** (Calendly / SavvyCal) — noted in REQUIREMENTS.md as v2. CTAs link to `/contact` for now.
- **Testimonials** — deferred to v2; pending client authorization for quotes.
- **Speaking / media appearances page** — v2.
- **Coaching pricing tiers** — if coaching eventually has defined packages, those belong in a future pricing update or v2 scope.

</deferred>

---

*Phase: 03-firm-substance-people-practice-areas-pricing*
*Context gathered: 2026-05-07*
