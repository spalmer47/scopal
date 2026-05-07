---
phase: 01-foundation-live-skeleton
plan: "02"
subsystem: compliance-layouts
tags: [astro, tailwind, constants, layouts, seo, json-ld, legal-disclaimers]
dependency_graph:
  requires:
    - astro-6-scaffold
    - tailwind-v4-tokens
  provides:
    - constants-single-source-of-truth
    - base-layout
    - marketing-layout
    - header-component
    - footer-component
    - footer-disclaimer-component
    - seo-component
    - legal-service-schema
    - placeholder-homepage
  affects:
    - all-subsequent-pages
    - phase-2-homepage
    - phase-3-practice-areas
    - phase-4-blog-contact
tech_stack:
  added: []
  patterns:
    - "Single source of truth for NAP + disclaimers in src/lib/constants.ts"
    - "Compliance-by-construction: BaseLayout renders Footer unconditionally"
    - "LegalService JSON-LD via <script type=application/ld+json set:html> from build-time constants"
    - "OKLCH color tokens applied in component Tailwind classes"
    - "MarketingLayout thin-wrapper pattern for layout hierarchy"
key_files:
  created:
    - src/lib/constants.ts
    - src/layouts/BaseLayout.astro
    - src/layouts/MarketingLayout.astro
    - src/components/layout/Header.astro
    - src/components/layout/Footer.astro
    - src/components/legal/FooterDisclaimer.astro
    - src/components/seo/SEO.astro
    - src/components/seo/LegalServiceSchema.astro
  modified:
    - src/pages/index.astro
decisions:
  - "pageTitle in index.astro derives Annandale/NJ from FIRM constants (not hardcoded) to satisfy must_have NAP-SOT truth"
metrics:
  duration: "~8 minutes"
  completed: "2026-05-07"
  tasks: 3
  files: 9
---

# Phase 1 Plan 02: Wire Compliance-by-Construction Layouts and Components Summary

JWT-style constants module + compliance-by-construction layout tree: any page using MarketingLayout automatically gets the full legally-required footer (attorney advertising, UPL disclaimer, no-attorney-client) and LegalService JSON-LD without writing any disclaimer code.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author src/lib/constants.ts (single source of truth) | 6dfae69 | src/lib/constants.ts |
| 2 | Author layout + component tree | 4f158ce | src/layouts/BaseLayout.astro, src/layouts/MarketingLayout.astro, src/components/layout/Header.astro, src/components/layout/Footer.astro, src/components/legal/FooterDisclaimer.astro, src/components/seo/SEO.astro, src/components/seo/LegalServiceSchema.astro |
| 3 | Replace src/pages/index.astro with MarketingLayout-wrapped homepage | a575c95 | src/pages/index.astro |

## Files Created

- `src/lib/constants.ts` — FIRM (NAP, disclaimers, responsibleAttorney, areaServed), ATTORNEYS (scott-palmer with barAdmissions), SOCIAL, BANNED_TERMS, formatBarStatus()
- `src/layouts/BaseLayout.astro` — HTML shell: lang=en, skip-to-content, Header, main#main slot, Footer (unconditional)
- `src/layouts/MarketingLayout.astro` — thin prop-forwarding wrapper around BaseLayout
- `src/components/layout/Header.astro` — brand wordmark + desktop CTA "Schedule a Consultation" → mailto:
- `src/components/layout/Footer.astro` — dark footer: NAP, email, responsibleAttorney, barStatus, FooterDisclaimer
- `src/components/legal/FooterDisclaimer.astro` — 3 required disclaimer paragraphs from FIRM constants
- `src/components/seo/SEO.astro` — title, meta description, canonical from Astro.site, OG tags, robots noindex
- `src/components/seo/LegalServiceSchema.astro` — LegalService JSON-LD via set:html from FIRM + ATTORNEYS constants

## formatBarStatus() Verification

`formatBarStatus()` returns exactly: `Maryland (2009); New Jersey admission pending`

Derivation: barAdmissions[0] = `{ state: 'Maryland', year: 2009, status: 'active' }` → `"Maryland (2009)"`;
barAdmissions[1] = `{ state: 'New Jersey', year: 0, status: 'pending' }` → `"New Jersey admission pending"`.
Joined with `"; "` → exact D17 string. Verified in dist/index.html.

## dist/index.html Verification

After `npm run build` (exits 0), `dist/index.html` contains:

- **Attorney advertising**: `Attorney Advertising. Prior results do not guarantee a similar outcome.` ✓
- **Bar status**: `Maryland (2009); New Jersey admission pending` ✓
- **No-attorney-client**: `does not create an attorney-client relationship` ✓
- **UPL disclaimer**: `licensed to practice law in Maryland; New Jersey admission pending` ✓
- **JSON-LD**: `<script type="application/ld+json">` with `"@type":"LegalService"`, `"name":"Scopal Firm, LLC"`, `"addressLocality":"Annandale"`, `"addressRegion":"NJ"` ✓
- **Canonical**: `<link rel="canonical" href="https://scopalfirm.com/">` ✓
- **H1 count**: exactly 1 ✓
- **CTA**: `Schedule a Consultation` (not "Contact Us" or "Free Consultation") ✓

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] pageTitle in index.astro hardcoded "Annandale" literal**
- **Found during:** Task 3 final verification
- **Issue:** The plan specified `const pageTitle = 'Scopal Firm — Annandale, NJ | Business-Focused Legal Support'` as a string literal. The must_have truth requires zero matches for "Annandale" in src/ outside constants.ts. The hardcoded literal violated this invariant.
- **Fix:** Changed to a template literal: `` `${FIRM.shortName} — ${FIRM.address.addressLocality}, ${FIRM.address.addressRegion} | Business-Focused Legal Support` `` — produces the identical rendered string while keeping Annandale/NJ as a single source of truth.
- **Files modified:** src/pages/index.astro
- **Commit:** a575c95

## Known Stubs

None. All placeholder copy is intentional and documented in UI-SPEC — it is replaced by the Phase 2 StoryBrand homepage, not by this plan.

## Threat Flags

No new threat surface introduced beyond what is documented in the plan's threat model (T-01-06 through T-01-11). Specifically:
- Footer is rendered unconditionally in BaseLayout (T-01-06 mitigated)
- NAP appears in only one place: src/lib/constants.ts (T-01-07 mitigated)
- JSON-LD payload is build-time constant, no user input (T-01-10 accepted)
- Canonical URL derives from Astro.site = https://scopalfirm.com (T-01-09 mitigated)

## Self-Check: PASSED

- [x] src/lib/constants.ts exists — FOUND
- [x] src/layouts/BaseLayout.astro exists — FOUND
- [x] src/layouts/MarketingLayout.astro exists — FOUND
- [x] src/components/layout/Header.astro exists — FOUND
- [x] src/components/layout/Footer.astro exists — FOUND
- [x] src/components/legal/FooterDisclaimer.astro exists — FOUND
- [x] src/components/seo/SEO.astro exists — FOUND
- [x] src/components/seo/LegalServiceSchema.astro exists — FOUND
- [x] src/pages/index.astro modified — FOUND
- [x] Commit 6dfae69 exists — FOUND
- [x] Commit 4f158ce exists — FOUND
- [x] Commit a575c95 exists — FOUND
- [x] dist/index.html contains all 3 disclaimers — VERIFIED
- [x] dist/index.html has exactly 1 h1 — VERIFIED
- [x] dist/index.html has LegalService JSON-LD with Annandale/NJ — VERIFIED
- [x] canonical = https://scopalfirm.com/ — VERIFIED
- [x] No "Annandale" in src/ outside constants.ts — VERIFIED
- [x] npm run build exits 0 — VERIFIED
