---
phase: 3
slug: firm-substance-people-practice-areas-pricing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (`astro build`) + Playwright for E2E + axe-core (CI) |
| **Config file** | `astro.config.mjs` / `.github/workflows/ci.yml` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx linkinator dist --recurse --skip "https://*"` |
| **Estimated runtime** | ~30–60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (catches type errors, broken imports, missing MDX fields)
- **After every plan wave:** Run full suite + `npx linkinator dist --recurse --skip "https://*"`
- **Before `/gsd-verify-work`:** Full suite must be green + axe-core passes on all new pages
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|--------|
| 03-x-01 | infra | 0 | PRAC-04 | PracticeAreaLayout rejects pages missing required props | build | `npm run build` | ⬜ pending |
| 03-x-02 | infra | 0 | PRAC-05 | FAQSchema/ServiceSchema/BreadcrumbSchema emit valid ld+json | build | `npm run build` | ⬜ pending |
| 03-x-03 | content | 1 | PRAC-01 | Practice area pages render at correct URLs | build | `npm run build && node -e "require('fs').existsSync('dist/practice-areas/corporate-law/index.html') || process.exit(1)"` | ⬜ pending |
| 03-x-04 | content | 1 | PRAC-02 | Each practice area page ≥800 words | manual | Word count check in UAT | ⬜ pending |
| 03-x-05 | content | 1 | PRAC-03 | FAQ blocks present on each practice area page | build | `npm run build` | ⬜ pending |
| 03-x-06 | bio | 1 | TEAM-01 | Scott bio page builds at /attorneys/scott-palmer | build | `npm run build` | ⬜ pending |
| 03-x-07 | bio | 1 | TEAM-04 | Bar status copy is exact match | build | `grep -r "New Jersey admission pending" dist/attorneys/` | ⬜ pending |
| 03-x-08 | team | 1 | TEAM-02 | Rachel page at /team/rachel-palmer (NOT /attorneys/) | build | `npm run build && node -e "require('fs').existsSync('dist/team/rachel-palmer/index.html') || process.exit(1)"` | ⬜ pending |
| 03-x-09 | pricing | 2 | PRICE-01 | Pricing page shows $995/month anchor | build | `grep -r "995" dist/pricing/` | ⬜ pending |
| 03-x-10 | pricing | 2 | PRICE-03 | No "Buy Now" or "Sign Up" on pricing page | build | `! grep -ri "buy now\|sign up" dist/pricing/` | ⬜ pending |
| 03-x-11 | nav | 0 | PRAC-01 | Header dropdown renders without JS error | build | `npm run build` | ⬜ pending |
| 03-x-12 | schema | 2 | PRAC-05 | JSON-LD present on practice area pages | build | `grep -r "application/ld+json" dist/practice-areas/` | ⬜ pending |
| 03-x-13 | schema | 2 | TEAM-03 | Person schema on bio page (not Attorney type) | build | `grep -r '"@type":"Person"' dist/attorneys/ && ! grep -r '"@type":"Attorney"' dist/attorneys/` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `PracticeAreaLayout.astro` — accepts required props, auto-injects disclaimer/FAQ/breadcrumbs/CTA
- [ ] `FAQSchema.astro` — emits valid FAQPage JSON-LD
- [ ] `BreadcrumbSchema.astro` — emits valid BreadcrumbList JSON-LD
- [ ] `PersonSchema.astro` — emits valid Person JSON-LD
- [ ] `ServiceSchema.astro` — emits valid Service JSON-LD
- [ ] `content.config.ts` coaching collection added
- [ ] Header dropdown (vanilla JS) — no new libraries
- [ ] Scott's headshot optimized to ≤200 KB → `src/assets/team/`
- [ ] **CHECKPOINT: Rachel's headshot committed by Scott** (blocking prerequisite — autonomous: false)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Practice area pages are 800–1,500+ words | PRAC-02 | Word count not automatable in build pipeline | Open each page in browser, use browser word count tool |
| Attorney-client disclaimer callout visible on practice area pages | PRAC-04 | Visual rendering check | View /practice-areas/corporate-law and /practice-areas/fractional-general-counsel |
| Pricing page comparison context woven into narrative | PRICE-02 | Content quality is subjective | Read pricing page prose in browser |
| Headshot images display at ≤200 KB, correct alt text | FOUND-05 / PRAC-01 | File size + visual check | Browser dev tools → Network tab |
| Google Rich Results Test validation | PRAC-05, TEAM-03 | External tool required | Test each URL at search.google.com/test/rich-results |
| Rachel's page clearly identifies non-attorney role | TEAM-02, TEAM-04 | UPL compliance visual check | Read /team/rachel-palmer in browser |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
