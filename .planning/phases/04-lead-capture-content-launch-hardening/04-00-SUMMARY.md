---
phase: "04-lead-capture-content-launch-hardening"
plan: "04-00"
subsystem: "assets"
tags: ["fonts", "og-image", "legal-components", "blog", "perf", "seo"]
dependency_graph:
  requires: []
  provides:
    - "public/fonts/Inter-Regular.woff2"
    - "public/fonts/Inter-SemiBold.woff2"
    - "public/fonts/Fraunces-SemiBold.woff2"
    - "public/og-default.jpg"
    - "src/components/legal/Testimonial.astro"
    - "src/components/legal/CaseResult.astro"
    - "src/content/blog/when-saas-needs-a-lawyer.mdx"
  affects:
    - "src/styles/global.css"
    - "src/layouts/BaseLayout.astro"
tech_stack:
  added:
    - "@fontsource/inter (devDependency — woff2 files extracted to public/fonts/)"
    - "@fontsource/fraunces (devDependency — woff2 files extracted to public/fonts/)"
  patterns:
    - "Self-hosted WOFF2 fonts via @fontsource extraction"
    - "font-display: swap for CLS/FOIT mitigation"
    - "SVG-to-JPEG OG image generation via sharp"
    - "Required (non-optional) disclaimer prop on legal components for build-time enforcement"
key_files:
  created:
    - public/fonts/Inter-Regular.woff2
    - public/fonts/Inter-SemiBold.woff2
    - public/fonts/Fraunces-SemiBold.woff2
    - public/og-default.jpg
    - src/components/legal/Testimonial.astro
    - src/components/legal/CaseResult.astro
    - src/content/blog/when-saas-needs-a-lawyer.mdx
  modified:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
decisions:
  - "Used @fontsource npm packages to extract latin-subset woff2 files — avoids CDN dependency and keeps file sizes small (Inter ~23K, Fraunces ~18K)"
  - "OG image generated at runtime via sharp SVG→JPEG pipeline; committed as a static binary so no build-time generation is required on Vercel"
  - "disclaimer prop on Testimonial/CaseResult is non-optional (no ?) — TypeScript enforces presence at every call site (LEGAL-04)"
metrics:
  duration: "~5 minutes"
  completed: "2026-05-08"
  tasks_completed: 2
  files_created: 7
  files_modified: 2
---

# Phase 4 Plan 00: Prerequisite Assets Summary

**One-liner:** Self-hosted Inter/Fraunces woff2 fonts (extracted from @fontsource), 1200×630 JPEG OG image via sharp, build-time-enforced legal components, and first published blog post.

## What Was Built

### Font Files (PERF-02)

Three woff2 files extracted from @fontsource latin subsets and committed to `public/fonts/`:

| File | Size | Weight |
|------|------|--------|
| Inter-Regular.woff2 | 23K | 400 |
| Inter-SemiBold.woff2 | 24K | 600 |
| Fraunces-SemiBold.woff2 | 18K | 600 |

All three are well within the 200 KB limit. Total: ~65K for all three fonts.

Three `@font-face` blocks added to `src/styles/global.css` with `font-display: swap` per design decision D10.

Two `<link rel="preload" as="font" ...>` tags added to `src/layouts/BaseLayout.astro`, replacing the TODO comment. Preload links appear before the `<SEO />` component.

### OG Image (SEO-03)

`public/og-default.jpg`: 1200×630 JPEG, 27K. Generated using sharp from an inline SVG with dark background (#0f172a), firm name, tagline, and URL. Well within 200 KB limit.

### Legal Components (LEGAL-04)

- `src/components/legal/Testimonial.astro` — Props: `quote: string`, `attribution: string`, `disclaimer: string` (required, no `?`)
- `src/components/legal/CaseResult.astro` — Props: `outcome: string`, `context: string`, `disclaimer: string` (required, no `?`)

TypeScript will produce a build error at any call site that omits the `disclaimer` prop — satisfying LEGAL-04 build-time enforcement requirement.

### First Blog Post (BLOG-05)

`src/content/blog/when-saas-needs-a-lawyer.mdx`:
- Title: "When Does a SaaS Company Need a Lawyer?" (42 chars, under 70 max)
- Description: "Most SaaS founders wait too long to get legal help. Here's how to know when it's time — and what kind of support makes sense at each stage." (140 chars, under 160 max)
- `pubDate: 2026-05-08`
- `author: scott-palmer`
- `draft: false`
- Tags: saas, startup-legal, fractional-gc

## Verification Results

- `npm run banned-words`: **clean** (0 violations)
- `npm run build`: **8 pages built in 1.82s** — no errors or warnings

## Commit

`7895a49` — feat(phase4): wave 0 — fonts, OG image, legal components, first blog post

## Deviations from Plan

None — plan executed exactly as written.

- @fontsource latin-subset woff2 files were available exactly at the expected paths
- sharp was available as a transitive dependency and generated the OG image without issues
- All file sizes came in well under the 200 KB limit

## Known Stubs

None. All components are fully wired:
- `Testimonial.astro` and `CaseResult.astro` accept runtime props (no hardcoded data)
- The blog post is a complete, published piece (draft: false) with real content

## Threat Flags

None. Font files (OFL licensed) and MDX content are intentionally public. No new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- public/fonts/Inter-Regular.woff2: FOUND
- public/fonts/Inter-SemiBold.woff2: FOUND
- public/fonts/Fraunces-SemiBold.woff2: FOUND
- public/og-default.jpg: FOUND (27K, 1200x630)
- src/components/legal/Testimonial.astro: FOUND (disclaimer: string — required)
- src/components/legal/CaseResult.astro: FOUND (disclaimer: string — required)
- src/content/blog/when-saas-needs-a-lawyer.mdx: FOUND (draft: false, author: scott-palmer)
- git commit 7895a49: FOUND
- npm run banned-words: PASSED
- npm run build: PASSED
