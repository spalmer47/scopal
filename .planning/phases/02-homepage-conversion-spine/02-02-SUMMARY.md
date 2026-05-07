---
phase: 02-homepage-conversion-spine
plan: "02"
subsystem: homepage
tags: [homepage, storybrand, sections, json-ld, seo]
dependency_graph:
  requires: [02-01]
  provides: [full-homepage, website-schema, section-components]
  affects: [src/pages/index.astro, src/layouts/BaseLayout.astro, src/layouts/MarketingLayout.astro]
tech_stack:
  added: []
  patterns: [json-ld-component, section-composition, storybrand-sequence]
key_files:
  created:
    - src/components/seo/WebSiteSchema.astro
    - src/components/sections/Hero.astro
    - src/components/sections/TrustStrip.astro
    - src/components/sections/ProactiveInsight.astro
    - src/components/sections/Plan.astro
    - src/components/sections/Stakes.astro
    - src/components/sections/SuccessVision.astro
    - src/components/sections/CTASection.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/layouts/MarketingLayout.astro
    - src/pages/index.astro
decisions:
  - "All four logo SVG files were present at execution time — used img tags for all logos; no fallback text needed"
  - "Fraunces font preload deferred — public/fonts/ directory does not exist; TODO comment added to BaseLayout.astro"
  - "Page title set to 'General Counsel for SaaS Companies | Scopal Firm' (49 chars, within 60-char limit)"
  - "inhoused.svg filename used (single 'e') — not inhouseed.svg as the plan comment suggested"
  - "MarketingLayout.astro interface updated to include emitWebSiteSchema prop (spread props still handle forwarding)"
metrics:
  duration: "~15 minutes"
  completed_date: "2026-05-07"
---

# Phase 2 Plan 02: Full StoryBrand Homepage Summary

**One-liner:** Built seven StoryBrand homepage sections with WebSite JSON-LD SearchAction, real logo trust strip, and three "Book a Fit Call" CTA touchpoints composing into a complete conversion-ready homepage.

---

## What Was Built

This plan built your homepage — the one a SaaS founder will actually see. It has:

1. **Hero** — The headline you chose ("You need a GC, but not the salary that comes with it.") with a sub-headline positioning Scopal as a dedicated General Counsel on subscription, and a "Book a Fit Call" button linking to /contact.

2. **Trust Strip** — Your prior in-house experience at uPerform and Ancile Solutions, and your professional associations (HeyCounsel, InHoused), displayed as two clearly labeled logo groups. All four SVG logo files were present and used as real logo images.

3. **Proactive Insight** — An explanation of why having a lawyer available consistently costs less than calling one in a crisis — your core messaging angle that separates Scopal from reactive law firm billing.

4. **3-Step Plan** — "Here's how it works" with the three locked steps: Schedule a fit call, We scope your legal needs, You get a dedicated legal partner. A "Book a Fit Call" button appears below the cards (mid-page CTA, HOME-05).

5. **Stakes** — The cost of getting this wrong: bad clauses, compliance gaps, deals lost. Left-aligned prose for emotional resonance.

6. **Success Vision** — What having a dedicated legal partner feels like: signing contracts with confidence, moving fast on deals, sleeping better. Arrow-list format in brand blue.

7. **Bottom CTA** — Dark background (bg-ink) with white text and an inverted white button: "Book a Fit Call". The third persistent CTA touchpoint.

The page also tells Google exactly what kind of site this is via two JSON-LD blocks — LegalService (already from Phase 1) and the new WebSite schema with SearchAction. This helps Google understand the site for search indexing.

---

## Task Outcomes

### Task 1: WebSiteSchema.astro + BaseLayout.astro patch

- **WebSiteSchema.astro** created following the `set:html={JSON.stringify(schema)}` pattern from LegalServiceSchema.astro
- `FIRM.url` and `FIRM.legalName` used from constants.ts — no hardcoded strings
- `{search_term_string}` preserved as a schema.org template variable in the urlTemplate
- BaseLayout.astro patched with `emitWebSiteSchema` prop (interface + destructuring + conditional render + import)
- MarketingLayout.astro interface updated to include `emitWebSiteSchema?: boolean` (spread props already forwarded it; interface update makes TypeScript explicit)
- **Fraunces preload deferred:** `public/fonts/` directory does not exist. Added TODO comment in BaseLayout.astro `<head>` per plan instruction.

### Task 2: Seven section components

All seven components created in `src/components/sections/`:

| Component | Key content | Background |
|-----------|-------------|------------|
| Hero.astro | Locked H1, sub-headline, Book a Fit Call → /contact | bg-surface |
| TrustStrip.astro | 4 logo img tags (all SVG files present), 2 labeled groups | bg-surface |
| ProactiveInsight.astro | "consistently costs less" heading + body | bg-surface-muted |
| Plan.astro | 3 step cards with locked names + mid-page CTA | bg-surface-muted |
| Stakes.astro | "cost of getting this wrong" heading + prose | bg-surface |
| SuccessVision.astro | "legal partner" heading + arrow list (3 items) | bg-surface |
| CTASection.astro | Inverted dark section, Book a Fit Call button | bg-ink |

**Logo files present (used img tags for all):**
- `uperform.svg` — Group 1 (Prior in-house experience)
- `ancile-solutions.svg` — Group 1 (Prior in-house experience)
- `heycounsel.svg` — Group 2 (Professional associations)
- `inhoused.svg` — Group 2 (Professional associations) — Note: filename is `inhoused.svg` (single 'e'), not `inhouseed.svg`

### Task 3: index.astro replacement

- Phase 1 placeholder fully replaced with 7-section StoryBrand composition
- Both `emitOrgSchema={true}` and `emitWebSiteSchema={true}` passed to MarketingLayout
- StoryBrand order: Hero → TrustStrip → ProactiveInsight → Plan → Stakes → SuccessVision → CTASection
- Page title: `General Counsel for SaaS Companies | Scopal Firm` (49 chars — within 60-char limit)
- Meta description: 153 chars — within 155-char limit

---

## Build Verification

```
npm run build — exits 0
dist/index.html contains: "You need a GC, but not the salary that comes with it." ✓
dist/index.html contains: "Prior in-house experience" ✓
dist/index.html contains: "Professional associations" ✓
dist/index.html contains "Book a Fit Call": 5 times (header + hero + plan + bottom CTA + mobile nav) ✓
dist/index.html contains: "search_term_string" ✓
dist/index.html contains: "@type":"WebSite" ✓
dist/index.html contains: "@type":"LegalService" ✓
dist/contact/index.html exists: ✓ (regression check — Plan 01 contact page intact)
npm run banned-words: clean ✓
```

---

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | d7d348b | feat(02-02): add WebSiteSchema JSON-LD component and patch BaseLayout |
| Task 2 | 44be1ff | feat(02-02): build all seven homepage section components |
| Task 3 | fc57f8f | feat(02-02): compose full StoryBrand homepage in index.astro |

---

## Deviations from Plan

None — plan executed exactly as written. The logo filename deviation (`inhoused.svg` vs plan comment `inhouseed.svg`) was expected and documented in the prompt context (`<logo_inventory>`).

The Fraunces font preload was deferred as specified in the plan instructions (check `public/fonts/` first — directory absent → add TODO comment, not a broken preload link).

---

## Known Stubs

None. All sections render real content. Logo images reference real SVG files confirmed present in `public/images/logos/`. No placeholder text, no hardcoded empty values, no TODO items in rendered output.

**One planned stub:** The hero visual column (Scott's headshot) is commented out because no image file exists yet. The text column renders full-width without the image. This is intentional per UI-SPEC ("omit column rather than use a placeholder image"). A note is left in the component markup showing exactly where to add the image when committed.

---

## Threat Flags

No new security-relevant surface introduced beyond what was in the plan's threat model:
- WebSiteSchema.astro emits public firm data (name, URL) via the established `set:html={JSON.stringify(schema)}` pattern
- Logo img tags reference self-hosted SVG files at `/images/logos/` — no CDN or third-party domains
- All sections are pre-rendered static HTML — no server-side processing, no user input

---

## Self-Check: PASSED

Files created:
- src/components/seo/WebSiteSchema.astro — FOUND
- src/components/sections/Hero.astro — FOUND
- src/components/sections/TrustStrip.astro — FOUND
- src/components/sections/ProactiveInsight.astro — FOUND
- src/components/sections/Plan.astro — FOUND
- src/components/sections/Stakes.astro — FOUND
- src/components/sections/SuccessVision.astro — FOUND
- src/components/sections/CTASection.astro — FOUND

Commits verified: d7d348b, 44be1ff, fc57f8f — all present in git log
