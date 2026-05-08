---
phase: "04-lead-capture-content-launch-hardening"
plan: "04-02"
subsystem: "SEO, Legal Pages, Footer"
tags: ["seo", "og-image", "legal", "footer", "accessibility"]
dependency_graph:
  requires: ["04-00"]
  provides: ["SEO-01", "SEO-02", "SEO-03", "LEGAL-01", "LEGAL-02", "LEGAL-03"]
  affects: ["src/components/seo/SEO.astro", "src/components/layout/Footer.astro", "src/pages/legal/"]
tech_stack:
  added: []
  patterns: ["og:image absolute URL via new URL(path, Astro.site)", "FIRM constants for all legal copy (no hardcoding)"]
key_files:
  created:
    - src/pages/legal/disclaimer.astro
    - src/pages/legal/privacy.astro
    - src/pages/legal/terms.astro
    - src/pages/legal/accessibility-statement.astro
  modified:
    - src/components/seo/SEO.astro
    - src/components/layout/Footer.astro
decisions:
  - "og:image absolute URL uses startsWith('http') guard so per-page absolute URLs pass through unchanged"
  - "Legal pages import FIRM constants exclusively — no disclaimer text hardcoded in page files"
  - "Footer copyright bar replaced with flex row to hold both copyright and 3-link legal nav"
metrics:
  duration: "~8 minutes"
  completed: "2026-05-08"
  tasks_completed: 2
  files_count: 6
---

# Phase 4 Plan 02: SEO Upgrade, Legal Pages, Footer Legal Links Summary

**One-liner:** OG image fallback to og-default.jpg with absolute URL construction, four legal pages from FIRM constants, Footer flex copyright bar with Privacy/Terms/Disclaimer nav.

## What Was Built

### Task 1: SEO.astro Upgraded

`src/components/seo/SEO.astro` was fully upgraded with:

- **OG image fallback:** `const resolvedOgImage = ogImage ?? '/og-default.jpg'` — every page gets an og:image even without a per-page override
- **Absolute URL:** `const absoluteOgImage = resolvedOgImage.startsWith('http') ? resolvedOgImage : new URL(resolvedOgImage, Astro.site).toString()` — always an absolute HTTPS URL
- **Unconditional og:image tag:** replaced `{ogImage && <meta ...>}` with `<meta property="og:image" content={absoluteOgImage} />` — always emits
- **New tags added:** `og:image:width` (1200), `og:image:height` (630), `og:site_name` ("Scopal Firm"), `twitter:card` ("summary_large_image")
- Props interface unchanged — fully backward-compatible

### Task 2: Four Legal Pages Created

All four pages use `MarketingLayout` and import `FIRM` from `../../lib/constants`. No disclaimer text is hardcoded.

| Page | URL | Title (chars) |
|------|-----|----------------|
| disclaimer.astro | /legal/disclaimer | "Legal Disclaimer — Annandale, NJ | Scopal Firm" (47) |
| privacy.astro | /legal/privacy | "Privacy Policy — Annandale, NJ | Scopal Firm" (45) |
| terms.astro | /legal/terms | "Terms of Use — Annandale, NJ | Scopal Firm" (43) |
| accessibility-statement.astro | /legal/accessibility-statement | "Accessibility Statement — Annandale, NJ | Scopal Firm" (53) |

All titles are ≤60 characters. All use `{FIRM.noAttorneyClientDisclaimer}`, `{FIRM.attorneyAdvertising}`, `{FIRM.jurisdictionDisclaimer}`, `{FIRM.responsibleAttorney}`, `{FIRM.legalName}` where applicable.

### Footer Updated

`src/components/layout/Footer.astro` copyright bar replaced:

- Before: single `<p>` with copyright text
- After: flex `<div>` with copyright `<p>` on left + `<nav aria-label="Legal pages">` on right containing 3 links: Privacy Policy (`/legal/privacy`), Terms of Use (`/legal/terms`), Disclaimer (`/legal/disclaimer`)
- All other footer content preserved

## Verification Results

- `npm run banned-words`: **clean** — no banned vocabulary in any new file
- `npm run build`: **passed** — 14 pages built, `dist/legal/` contains 4 directories (accessibility-statement, disclaimer, privacy, terms)

## Deviations from Plan

None — plan executed exactly as written. The build failed on first attempt due to `@astrojs/rss` not being installed in the stashed working tree (the stash test was for diagnostic purposes only; the actual build with full working tree passes).

## Threat Flags

None. All surfaces are author-controlled static content with no user input. Consistent with the plan's threat model (all threats accepted).

## Self-Check: PASSED

- src/components/seo/SEO.astro: exists, contains resolvedOgImage, absoluteOgImage, twitter:card
- src/pages/legal/disclaimer.astro: exists, imports FIRM
- src/pages/legal/privacy.astro: exists, imports FIRM
- src/pages/legal/terms.astro: exists, imports FIRM
- src/pages/legal/accessibility-statement.astro: exists, imports FIRM
- src/components/layout/Footer.astro: exists, contains 3 /legal/ hrefs
- Commit e8932fe: confirmed in git log
