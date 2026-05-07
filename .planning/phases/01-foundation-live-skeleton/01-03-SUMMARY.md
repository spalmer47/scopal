---
phase: 01-foundation-live-skeleton
plan: "03"
subsystem: security-and-content-schema
tags: [security-headers, csp, hsts, gitignore, env-hygiene, content-collections, zod, robots-txt, vercel]
dependency_graph:
  requires:
    - 01-01 (astro scaffold, astro.config.mjs with env.schema)
  provides:
    - vercel-security-headers
    - secret-hygiene-gitignore
    - env-example-docs
    - content-collection-schemas
    - robots-txt
  affects:
    - 01-05 (deploy: headers become observable after Vercel deploy)
    - phase-3 (practiceAreas and team content collections populated)
    - phase-4 (blog collection populated, RESEND_API_KEY and CONTACT_TO_EMAIL activated)
tech_stack:
  added: []
  patterns:
    - "vercel.json headers block for edge-level security headers"
    - "Astro 6 content.config.ts at repo root (not src/content/config.ts legacy path)"
    - "glob loader from astro/loaders (not astro:content)"
    - "Zod schema validation for content collections"
key_files:
  created:
    - vercel.json
    - .env.example
    - content.config.ts
    - public/robots.txt
    - src/content/blog/.gitkeep
    - src/content/practice-areas/.gitkeep
    - src/content/team/.gitkeep
  modified:
    - .gitignore
decisions:
  - "CSP copied verbatim from RESEARCH.md Example A — no deviations; whitelists va.vercel-scripts.com and vitals.vercel-insights.com for Vercel Web Analytics"
  - "HSTS max-age=63072000; includeSubDomains; preload matches FOUND-02 and hstspreload.org submission requirements exactly"
  - "content.config.ts placed at repo root per Astro 6 convention (src/content/config.ts is the deprecated Astro 5 path)"
  - ".gitignore merged canonical entries into existing scaffold-generated file, preserving all plan-required exclusion patterns"
metrics:
  duration: "~2 minutes"
  completed: "2026-05-07"
  tasks: 3
  files: 8
---

# Phase 1 Plan 03: Security Headers, Secret Hygiene, and Content Collections Summary

Six OWASP-recommended HTTP security headers in vercel.json, .gitignore excluding all .env* patterns, .env.example documenting the two env vars from astro.config.mjs, and Zod-schema'd content collections for blog/practiceAreas/team at the Astro 6 repo-root path — all with npm run build succeeding on empty collections.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author vercel.json with six security headers and immutable asset cache | d0d58b1 | vercel.json |
| 2 | Author .gitignore and .env.example for secret hygiene | c2e5391 | .gitignore, .env.example |
| 3 | Author content.config.ts, seed empty content folders, write robots.txt | 9f4b143 | content.config.ts, public/robots.txt, src/content/{blog,practice-areas,team}/.gitkeep |

## Verification Results

### Task 1 — vercel.json
- `node -e "JSON.parse(...)"` exits 0 — JSON is valid
- All 6 security headers present with exact required values:
  - `Content-Security-Policy` with `frame-ancestors 'none'`, `script-src 'self' https://va.vercel-scripts.com`, `connect-src 'self' https://vitals.vercel-insights.com`, `form-action 'self'`, `base-uri 'self'`, `object-src 'none'`, `upgrade-insecure-requests`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `/_astro/(.*)` rule sets `Cache-Control: public, max-age=31536000, immutable`

### Task 2 — .gitignore and .env.example
- `git check-ignore -q .env` exits 0 — PASS
- `git check-ignore -q .env.local` exits 0 — PASS
- `.gitignore` contains all required entries: `.env`, `.env.local`, `.env.*.local`, `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.DS_Store`, `.idea/`
- `.env.example` contains `RESEND_API_KEY=` and `CONTACT_TO_EMAIL=` (no values, no other vars)
- `find . -maxdepth 2 -name '.env*' -not -name '.env.example' -not -path './node_modules/*'` returns empty — PASS

### Task 3 — content.config.ts, content folders, robots.txt
- `content.config.ts` exists at repo root (not `src/content/config.ts`)
- Imports `defineCollection`, `z` from `astro:content`; `glob` from `astro/loaders`
- Three collections exported: `blog`, `practiceAreas`, `team`
- `blog` schema: `title` (max 70), `description` (max 160), `pubDate`, `author: z.literal('scott-palmer')`, `tags`, `heroImage`, `draft`
- `practiceAreas` schema: `title`, `shortTitle`, `description` (max 160), `order`, `icon`, `faqs`
- `team` schema: `name`, `role`, `isAttorney`, `barAdmissions` (with `status: z.enum(['active','pending'])`), `education`, `headshot`, `email`, `linkedin`
- `src/content/blog/.gitkeep`, `src/content/practice-areas/.gitkeep`, `src/content/team/.gitkeep` all exist
- `public/robots.txt` contains `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: https://scopalfirm.com/sitemap-index.xml`
- `npm run build` exits 0 — PASS
- `dist/sitemap-index.xml` produced by `@astrojs/sitemap` — PASS (sitemap-index.xml variant)
- `dist/robots.txt` exists (copied from public/) — PASS
- `dist/index.html` exists and unchanged from Plan 02 output — PASS

## CSP Deviation Audit

No deviations from RESEARCH.md Example A CSP. The Content-Security-Policy value is copied verbatim:
```
default-src 'self'; script-src 'self' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Entries] Existing .gitignore lacked canonical entries**
- **Found during:** Task 2
- **Issue:** The scaffold-generated `.gitignore` (from Plan 01) was missing `.env.local`, `.env.*.local`, `.vercel/` (had `.vercel` without trailing slash), `Thumbs.db`, `.vscode/`, and `index.html.legacy.bak`
- **Fix:** Rewrote `.gitignore` with the canonical content from RESEARCH.md Example G, merging in all plan-required entries. The old file had `.env.production` (a non-standard pattern); this was replaced with the correct `.env.*.local` glob pattern as specified in the plan
- **Files modified:** `.gitignore`
- **Commit:** c2e5391

None of the other tasks required deviations. Content verbatim from RESEARCH.md.

## Known Stubs

None. All files are complete and functional. Content collections are intentionally empty (`.gitkeep` only) per plan design — Phase 3 and Phase 4 populate them.

## Threat Flags

No new threat surface introduced beyond what the plan's threat model documents (T-01-12 through T-01-22). The `vercel.json` headers actively mitigate T-01-12 through T-01-17; `.gitignore` mitigates T-01-18.

Note: Headers (T-01-12..T-01-17) are declared in `vercel.json` but only become observable after Plan 05 deploys to Vercel. The vercel.json file is complete and correct as of this plan.

## Self-Check: PASSED

- [x] `vercel.json` exists — FOUND
- [x] `.gitignore` exists and contains `.env` — FOUND
- [x] `.env.example` exists and contains `RESEND_API_KEY=` — FOUND
- [x] `content.config.ts` exists at repo root — FOUND
- [x] `public/robots.txt` exists — FOUND
- [x] `src/content/blog/.gitkeep` exists — FOUND
- [x] `src/content/practice-areas/.gitkeep` exists — FOUND
- [x] `src/content/team/.gitkeep` exists — FOUND
- [x] Commit d0d58b1 exists — FOUND
- [x] Commit c2e5391 exists — FOUND
- [x] Commit 9f4b143 exists — FOUND
- [x] `npm run build` succeeded — VERIFIED
- [x] `dist/sitemap-index.xml` produced — VERIFIED (sitemap-index.xml variant)
- [x] `dist/robots.txt` exists — VERIFIED
- [x] `git check-ignore -q .env` exits 0 — VERIFIED
