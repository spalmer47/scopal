# Phase 2: Homepage + Conversion Spine — Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the StoryBrand homepage that converts a SaaS founder in the first viewport — hero with client-problem-first H1, proactive-vs-reactive insight, persistent CTA, trust strip, 3-step plan section, and JSON-LD (LegalService + WebSite with SearchAction). Phase 2 also builds a placeholder `/contact` page and updates the header nav.

**What this phase ships:**
- `src/pages/index.astro` — full StoryBrand homepage (replaces Phase 1 placeholder)
- `src/pages/contact.astro` — placeholder contact page (full form is Phase 4)
- Updated `src/components/layout/Header.astro` — real nav links + CTA button
- New homepage section components (Hero, TrustStrip, Plan, ProactiveInsight, CTA)
- New JSON-LD components (WebSiteSchema, SearchAction)
- Logo assets in `public/images/logos/` (provided by Scott before execution)

**What this phase does NOT ship:**
- Real contact form (Phase 4)
- Practice area pages, bio pages, pricing page (Phase 3)
- Blog system (Phase 4)

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** H1 copy: **"You need a GC, but not the salary that comes with it."** — client-problem-first, names the friction (full-time cost), sets up the subscription pitch. Do not alter this line.
- **D-02:** Sub-headline direction: Scopal is the visitor's dedicated General Counsel — available consistently, invested in their business, subscription-priced for SaaS companies not ready to hire full-time. Claude drafts the exact sub-headline wording during planning; direction is locked.
- **D-03:** Hero flows immediately into the proactive-vs-reactive insight (HOME-03) — this insight must appear within the first two sections, not buried lower in the page.

### 3-Step Plan Section
- **D-04:** Three steps (exact names): **Step 1: Schedule a fit call / Step 2: We scope your legal needs / Step 3: You get a dedicated legal partner**
- **D-05:** Each step includes a 1–2 sentence description. Claude drafts descriptions during planning; they should emphasize ease (Step 1), Scott's process (Step 2), and the ongoing relationship value (Step 3).

### Trust Strip
- **D-06:** Scott has logo files (SVG or PNG) for some or all of: uPerform, Ancile Solutions, HeyCounsel, InHoused. Use real logo marks where available; fall back to styled text for any missing mark.
- **D-07:** Two-group layout:
  - Group 1 — labeled **"Prior in-house experience"**: uPerform, Ancile Solutions
  - Group 2 — labeled **"Professional associations"**: HeyCounsel, InHoused
  - No mixed single-row. Clear visual separation between groups.
- **D-08: ⚠ Action required before execution:** Scott must commit logo files to `public/images/logos/` before the execution agent runs. Logo filenames should follow kebab-case (e.g., `uperform.svg`, `ancile-solutions.svg`, `heycounsel.svg`, `inhouseed.svg`). Planning should include a blocking prerequisite step for this.
- **D-09:** Trust strip appears in the first viewport per HOME-04. It follows the hero + sub-headline and precedes the body sections.
- **D-10:** No client logo wall — logos represent Scott's background, not current clients. The "Prior in-house experience" label enforces this distinction visually.

### CTA Destination
- **D-11:** Phase 2 builds a placeholder `/contact` page at `src/pages/contact.astro`. Content: a brief note that the contact form is being built + a `mailto:scott@scopalfirm.com` link. Uses `MarketingLayout`.
- **D-12:** All CTA buttons (hero, mid-page, bottom) link to `/contact`. CTA text follows D16 from project decisions: "Book a Fit Call" or "Schedule a Consultation" — never "Contact Us" or "Free Consultation".
- **D-13:** Persistent CTA appears at top (header button), mid-page (inside or below the 3-step plan), and bottom (page-end CTA section) per HOME-05.

### Navigation
- **D-14:** Header updated with: firm logo (left) + nav links (center/right) + "Book a Fit Call" CTA button (far right).
- **D-15:** Nav links to add: **Practice Areas** (`/practice-areas`), **Scott Palmer** (`/attorneys/scott-palmer`), **Pricing** (`/pricing`). These pages don't exist until Phase 3 — 404s are acceptable until then.
- **D-16:** Mobile nav (hamburger menu) implemented with vanilla `<script>` per D12 from project decisions (zero JS by default; mobile menu is the exception).

### JSON-LD
- **D-17:** Homepage emits two JSON-LD blocks via dedicated Astro components:
  1. `LegalServiceSchema` (already exists from Phase 1) — no changes needed
  2. New `WebSiteSchema` component with `SearchAction` pointing to `https://scopalfirm.com/search?q={search_term_string}` per HOME-06. (No actual search page needed — this is a Google sitelinks hint, not a functional search box.)

### Claude's Discretion
- Exact sub-headline wording (direction locked in D-02; Claude writes the final copy)
- Step descriptions for the 3-step plan (direction locked in D-05; Claude writes them)
- Visual layout / Tailwind styling for all sections (follows design system from 01-UI-SPEC.md)
- StoryBrand body section copy (problem agitation, guide positioning, stakes, success vision) — Claude drafts based on FIRM_BRIEF.md; Scott reviews during UAT
- Component file structure (how many components, what they're named)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Firm Identity & Messaging
- `.planning/FIRM_BRIEF.md` — firm profile, team bios, client description, positioning, fee structure, tone, design direction. Primary source for all copy decisions.
- `.planning/LAW_FIRM_WEBSITE_GUIDE.md` — law firm website best practices: StoryBrand structure, ABA advertising rules, SEO/AEO, conversion patterns, disclaimer requirements.

### Phase Requirements & Success Criteria
- `.planning/ROADMAP.md` §Phase 2 — goal, 5 success criteria (HOME-01..07), dependencies
- `.planning/REQUIREMENTS.md` §Homepage — HOME-01 through HOME-07 (7 requirements with full detail)

### Design System (locked in Phase 1)
- `.planning/phases/01-foundation-live-skeleton/01-UI-SPEC.md` — typography (Inter body / Fraunces display), spacing scale, color tokens, component patterns, container width. All Phase 2 components inherit this system.
- `.planning/phases/01-foundation-live-skeleton/01-PATTERNS.md` — Astro component patterns, `constants.ts` structure, `BaseLayout`/`MarketingLayout` patterns, JSON-LD component pattern (`set:html={JSON.stringify(schema)}`), NAP single-source-of-truth rule.

### Existing Source Files to Read Before Touching
- `src/styles/global.css` — `@theme {}` block: color tokens (`brand-blue-*`, `brand-orange-500`), font tokens (`font-display` = Fraunces, `font-body` = Inter)
- `src/lib/constants.ts` — NAP, bar admissions, banned terms, firm data. All copy referencing firm info reads from here.
- `src/layouts/BaseLayout.astro` — layout hierarchy; Footer (with disclaimers) is auto-injected here
- `src/layouts/MarketingLayout.astro` — thin wrapper; homepage and `/contact` use this
- `src/components/layout/Header.astro` — will be updated (D-14, D-15, D-16)
- `src/components/seo/LegalServiceSchema.astro` — existing JSON-LD component; understand pattern before adding WebSiteSchema

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MarketingLayout.astro` — use for both `index.astro` (homepage) and `contact.astro` (placeholder); pass `emitOrgSchema={true}` on homepage
- `LegalServiceSchema.astro` — already wired to homepage; no changes needed for Phase 2
- `constants.ts` → `FIRM.email` — use for the mailto link on placeholder `/contact` page
- `constants.ts` → `FIRM.responsibleAttorney`, `FIRM.areaServed` — use in JSON-LD components
- `global.css` `@theme` tokens — use `brand-orange-500` for primary CTAs, `brand-blue-900` for headings, `brand-blue-500` for accents

### Established Patterns
- **JSON-LD via component:** New `WebSiteSchema.astro` must follow the `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` pattern — never inline JSON-LD in page files
- **NAP single-source rule:** Any firm data (name, email, URL) in new components reads from `constants.ts` — never hardcoded strings
- **Disclaimer injection:** Disclaimers render automatically via `BaseLayout` → `Footer` → `FooterDisclaimer`. No disclaimer code needed in page files.
- **Banned words CI:** `scripts/banned-words.mjs` runs on every PR. Copy must not contain: "specialist," "specializing in," "expert," "the best," "#1," "leading," "top-rated"
- **Astro Props interface:** Every new component with props defines `interface Props {}` in the frontmatter fence

### Integration Points
- `index.astro` completely replaces the Phase 1 placeholder — import new section components
- `Header.astro` gets nav links added; mobile menu `<script>` block added here
- New `WebSiteSchema.astro` component → imported by `BaseLayout.astro` (or `MarketingLayout.astro`) and conditionally emitted on homepage
- Logo images placed in `public/images/logos/` → referenced in `TrustStrip.astro` as static paths (not processed by `astro:assets` since they're SVG brand marks)

</code_context>

<specifics>
## Specific Ideas

- **Visual reference:** newfangled.legal — retro-modern, approachable, personality-driven. Not stuffy law firm. Builds trust through personality. Clean whitespace, vibrant accents, unconventional layout. Color direction: orange and blue in small doses as accents on a clean white/light base.
- **Trust strip label copy:** "Prior in-house experience" and "Professional associations" — exact label strings decided
- **CTA button text variants:** "Book a Fit Call" (primary/conversational) and "Schedule a Consultation" (secondary/formal) — both acceptable per D16. Use "Book a Fit Call" as the primary CTA.
- **SearchAction URL template:** `https://scopalfirm.com/search?q={search_term_string}` — this is a schema hint to Google, not a functional search page

</specifics>

<deferred>
## Deferred Ideas

- **Calendar scheduler embed** (Calendly / SavvyCal) — noted in REQUIREMENTS.md as v2. Would replace the `/contact` CTA destination when added. Do not build in Phase 2.
- **Testimonials** — deferred to v2 pending Scott's confirmation that prior clients will provide quotes (per REQUIREMENTS.md). Trust strip is the social proof mechanism for Phase 2.
- **Hero imagery / headshot in hero** — design direction not decided. Claude may include a headshot or abstract visual in the hero at discretion, but the priority is text and CTA performance, not image prominence.

</deferred>

---

*Phase: 02-homepage-conversion-spine*
*Context gathered: 2026-05-07*
