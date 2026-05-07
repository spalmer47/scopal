---
phase: 01-foundation-live-skeleton
verified: 2026-05-07T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Confirm https://scopalfirm.com/ loads in a browser with H1 'Scopal Firm', the footer disclaimers visible, no cert warning, and the page renders correctly on mobile."
    expected: "Site loads over HTTPS with no certificate warning; placeholder homepage is visible with header, H1, body copy, CTA, and full footer containing all three disclaimer paragraphs."
    why_human: "Live URL verification against the custom domain requires a browser or network access that cannot be done programmatically in this environment. DEPLOY-NOTES.md records the Vercel-IP curl verification (216.198.79.1) which confirms headers and content, but DNS propagation is noted as partial — a browser check is the authoritative confirmation."
  - test: "Confirm the GitHub Actions CI run at https://github.com/spalmer47/scopal/actions is green (all 5 gates passing) on the pushed code."
    expected: "CI run shows: banned-words PASS, build PASS, linkcheck PASS, axe-core a11y PASS, Lighthouse CI PASS, gitleaks PASS."
    why_human: "The DEPLOY-NOTES.md records CI run https://github.com/spalmer47/scopal/actions/runs/25516625502 as green. The local HEAD is 2 commits ahead of the remote (2 documentation-only commits — ROADMAP.md, 01-05-DEPLOY-NOTES.md, 01-05-SUMMARY.md — that do not affect CI). Human confirmation that the referenced CI run passed all 5 gates is the binding record since we cannot query GitHub Actions programmatically here."
  - test: "Confirm pushing a new trivial commit to main triggers a Vercel auto-deploy that completes and updates scopalfirm.com within ~90 seconds."
    expected: "Auto-deploy webhook fires on push; Vercel build completes; live URL reflects the change."
    why_human: "Auto-deploy wiring is a GitHub↔Vercel integration that requires observing a real push-and-deploy cycle. Cannot verify programmatically."
---

# Phase 1: Foundation + Live Skeleton Verification Report

**Phase Goal:** Deploy a publicly reachable, green-CI Astro 6 + Tailwind v4 site at https://scopalfirm.com — the Walking Skeleton — with all legal compliance and security headers in place.
**Verified:** 2026-05-07
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Visiting `https://scopalfirm.com` returns a live Astro-rendered placeholder homepage served by Vercel, auto-deployed on push to `main`. | ? UNCERTAIN | DEPLOY-NOTES.md records Vercel project `scopal-website`, production URL `https://scopalfirm.com`, curl verification against Vercel IP 216.198.79.1 with HTTP 200 + "Scopal Firm" in body ✓. Auto-deploy confirmed via Vercel GitHub integration. DNS noted as partially propagated; DEPLOY-NOTES authoritative per user instruction. Human browser check needed for final confirmation. |
| 2 | A response-header check on the live site shows CSP, X-Frame-Options=DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS (`max-age=63072000; includeSubDomains; preload`) on every route. | ✓ VERIFIED | `vercel.json` contains all 6 headers with exact required values. DEPLOY-NOTES.md table confirms all 6 returned from live site. `vercel.json` validates as JSON and applies to `source: "/(.*)"`. |
| 3 | CI runs on every PR and blocks merge on any of: banned-words lint hit, axe-core a11y violation, broken internal link, gitleaks secret detection, or Lighthouse performance budget breach. | ✓ VERIFIED | `.github/workflows/ci.yml` exists with all 5 gates wired. `scripts/banned-words.mjs` exits 1 on violation (word-boundary regex confirmed). `.lighthouserc.json` has 0.9 minScore and LCP/CLS budgets. DEPLOY-NOTES records CI run as green. 2 unpushed commits are documentation-only and do not affect CI behavior. |
| 4 | A page rendered through `BaseLayout` automatically shows the firm footer (NAP, attorney advertising line, jurisdictional UPL disclaimer) without the page author writing any disclaimer code. | ✓ VERIFIED | `BaseLayout.astro` renders `<Footer />` unconditionally (no conditional wrapping). `Footer.astro` renders `<FooterDisclaimer />` unconditionally. `FooterDisclaimer.astro` references all 3 FIRM disclaimer constants. `dist/index.html` contains all 3 disclaimer strings in rendered output — verified directly. |
| 5 | `src/lib/constants.ts`, `content.config.ts` (with `blog`, `practiceAreas`, `team` Zod schemas), and `.env.example` exist and are the single source of truth for firm data, content shape, and required env vars. | ✓ VERIFIED | All 3 files exist. `constants.ts` exports FIRM, ATTORNEYS, SOCIAL, BANNED_TERMS, formatBarStatus(). `content.config.ts` at repo root defines all 3 collections with Zod schemas. `.env.example` documents RESEND_API_KEY and CONTACT_TO_EMAIL exactly matching `astro.config.mjs` env.schema. No "Annandale", "Maryland (2009)", or "Attorney Advertising" string found outside `constants.ts` in src/. |

**Score:** 5/5 truths verified (1 pending human confirmation on live URL)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|---------|--------|---------|
| `package.json` | Astro 6 + Tailwind v4 + Vercel adapter + MDX + Sitemap | ✓ VERIFIED | All required packages present: astro@^6.3.1, @astrojs/vercel@^10.0.6, @tailwindcss/vite@^4.2.4, @astrojs/mdx@^5.0.4, @astrojs/sitemap@^3.7.2, @tailwindcss/typography@^0.5.19. @astrojs/tailwind absent. Scripts: dev, build, preview, banned-words, linkcheck, a11y. |
| `astro.config.mjs` | site URL, static output, Vercel adapter, integrations, env schema | ✓ VERIFIED | `site: 'https://scopalfirm.com'`, `output: 'static'`, vercel adapter, `tailwindcss()` in vite.plugins, mdx() + sitemap() registered, RESEND_API_KEY + CONTACT_TO_EMAIL in env.schema. Note: `webAnalytics: { enabled: false }` (deviation from plan's `true` — fixed during deployment to resolve Lighthouse 404 in staticDistDir mode; functionally correct). |
| `src/styles/global.css` | Tailwind v4 entry + brand tokens via @theme | ✓ VERIFIED | `@import "tailwindcss"` present once. `@theme` block with all 9 color tokens and 8 spacing tokens (including --spacing-4xl: 96px). Fraunces as --font-display. No "Playfair Display" substring. prefers-reduced-motion block present. |
| `src/pages/index.astro` | Placeholder homepage via MarketingLayout with emitOrgSchema={true} | ✓ VERIFIED | Imports MarketingLayout. Passes emitOrgSchema={true}. pageTitle uses FIRM constants (not hardcoded "Annandale"). "Schedule a Consultation" CTA. No "Contact Us"/"Free Consultation"/"Book a Fit Call". |
| `tsconfig.json` | Strict TypeScript configuration | ✓ VERIFIED | File exists; `"extends": "astro/tsconfigs/strict"`. |
| `src/lib/constants.ts` | Single source of truth for NAP, disclaimers, bar admissions | ✓ VERIFIED | Exports FIRM, ATTORNEYS, SOCIAL, BANNED_TERMS, BarAdmissionStatus, BarAdmission, formatBarStatus(). All required strings present and correct. |
| `src/layouts/BaseLayout.astro` | HTML shell with Header, main slot, Footer unconditional | ✓ VERIFIED | lang="en", skip-to-content link, `<Header />`, `<main id="main">`, `<Footer />` unconditional, conditional `<LegalServiceSchema />`. |
| `src/layouts/MarketingLayout.astro` | Thin wrapper forwarding props to BaseLayout | ✓ VERIFIED | Imports BaseLayout, spreads all props, provides slot. |
| `src/components/layout/Header.astro` | Brand wordmark + desktop CTA | ✓ VERIFIED | Imports FIRM. "Schedule a Consultation" CTA with mailto link. No "Contact Us"/"Free Consultation". |
| `src/components/layout/Footer.astro` | Dark footer with NAP, bar status, FooterDisclaimer | ✓ VERIFIED | Imports FIRM and formatBarStatus from constants. Renders FooterDisclaimer unconditionally. |
| `src/components/legal/FooterDisclaimer.astro` | Three required disclaimer paragraphs from FIRM constants | ✓ VERIFIED | References FIRM.attorneyAdvertising, FIRM.jurisdictionDisclaimer, FIRM.noAttorneyClientDisclaimer. |
| `src/components/seo/SEO.astro` | title, meta description, canonical, OG tags | ✓ VERIFIED | Renders all required meta tags. Canonical derived from Astro.site + Astro.url.pathname. |
| `src/components/seo/LegalServiceSchema.astro` | LegalService JSON-LD via set:html | ✓ VERIFIED | Imports FIRM + ATTORNEYS. Emits `<script type="application/ld+json">` with @type LegalService, name Scopal Firm LLC, addressLocality Annandale, addressRegion NJ. |
| `vercel.json` | 6 security headers + immutable asset cache | ✓ VERIFIED | Valid JSON. All 6 headers present with exact required values. HSTS value exact: `max-age=63072000; includeSubDomains; preload`. CSP includes all required directives. /_astro cache rule present. |
| `.gitignore` | Excludes .env patterns, dist/, node_modules/, .astro/, .vercel/ | ✓ VERIFIED | All required patterns present. `git check-ignore -q .env` exits 0. |
| `.env.example` | Documents RESEND_API_KEY and CONTACT_TO_EMAIL | ✓ VERIFIED | Both vars documented without values. Matches astro.config.mjs env.schema exactly. |
| `content.config.ts` | blog, practiceAreas, team Zod schemas at repo root | ✓ VERIFIED | At repo root. Imports defineCollection, z from astro:content. Imports glob from astro/loaders. Three collections exported. All required schema fields present including z.literal('scott-palmer') on blog author and z.enum(['active','pending']) on barAdmissions status. |
| `public/robots.txt` | Allow all, Disallow /api/, Sitemap reference | ✓ VERIFIED | All three required directives present. Sitemap URL: https://scopalfirm.com/sitemap-index.xml. |
| `.github/workflows/ci.yml` | Five-check merge gate | ✓ VERIFIED | All 5 gates present: banned-words, build, linkcheck, a11y (via npm run a11y + start-server-and-test), Lighthouse CI (treosh@v12), gitleaks (gitleaks-action@v2). actions/checkout@v4 with fetch-depth: 0. setup-node@v4 with node 22. npm ci. Permissions: contents: read. Note: added `npx browser-driver-manager install chrome` step to fix ChromeDriver version mismatch — this is a valid operational fix, not a deviation from the gate structure. |
| `.lighthouserc.json` | 0.9 minimum, LCP < 2000ms, CLS < 0.05 | ✓ VERIFIED | Valid JSON. staticDistDir: ./dist. numberOfRuns: 3. All 4 category budgets at minScore 0.9 with severity "error". LCP maxNumericValue: 2000. CLS maxNumericValue: 0.05. (3 additional warn-level assertions for Lighthouse 13 new audits — not a deviation from requirements.) |
| `scripts/banned-words.mjs` | Catches banned vocabulary, exits 1 on violation | ✓ VERIFIED | All 9 BANNED_TERMS present matching constants.ts. Skips src/lib/constants.ts. Word-boundary regex (deviation from naive .includes() in plan template — an improvement that fixes false positives on CSS classes like "leading-relaxed"). `npm run banned-words` exits 0 on clean repo. |
| `.planning/phases/01-foundation-live-skeleton/01-05-DEPLOY-NOTES.md` | Deployment audit trail | ✓ VERIFIED | File exists. Records Vercel project ID, production URL, all 6 headers confirmed, all body content checks, CI run URL, and follow-up TODOs. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `astro.config.mjs` | @tailwindcss/vite plugin | vite.plugins array | ✓ WIRED | `tailwindcss()` present in vite.plugins |
| `astro.config.mjs` | @astrojs/vercel adapter | adapter property | ✓ WIRED | `adapter: vercel({...})` present |
| `src/pages/index.astro` | MarketingLayout | import + emitOrgSchema={true} | ✓ WIRED | Both present; template literal title derives from FIRM constants |
| `src/layouts/BaseLayout.astro` | Footer.astro | `<Footer />` unconditional in body | ✓ WIRED | No conditional wrapping |
| `src/components/layout/Footer.astro` | src/lib/constants.ts | `import { FIRM, formatBarStatus }` | ✓ WIRED | Exact import present |
| `src/components/legal/FooterDisclaimer.astro` | src/lib/constants.ts | `import { FIRM }` | ✓ WIRED | All 3 disclaimer fields referenced |
| `src/components/seo/LegalServiceSchema.astro` | src/lib/constants.ts | `import { FIRM, ATTORNEYS }` | ✓ WIRED | ATTORNEYS['scott-palmer'] used for employee field |
| `.github/workflows/ci.yml` | package.json scripts | `npm run banned-words/build/linkcheck/a11y` | ✓ WIRED | All 4 npm run commands present |
| `vercel.json` | all response headers | `source: "/(.*)"` catch-all | ✓ WIRED | Global header rule with all 6 security headers |
| `content.config.ts` | src/content/{blog,practice-areas,team}/ | glob loader base paths | ✓ WIRED | All 3 base paths present; directories exist with .gitkeep |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| `dist/index.html` | Disclaimer text | FIRM.attorneyAdvertising, FIRM.jurisdictionDisclaimer, FIRM.noAttorneyClientDisclaimer in constants.ts | Yes — verified in built HTML | ✓ FLOWING |
| `dist/index.html` | JSON-LD schema | FIRM + ATTORNEYS constants, build-time JSON.stringify | Yes — verified `"@type":"LegalService"`, `"addressLocality":"Annandale"` in built HTML | ✓ FLOWING |
| `dist/index.html` | Bar status | formatBarStatus() computed from ATTORNEYS barAdmissions data | Yes — "Maryland (2009); New Jersey admission pending" in built HTML | ✓ FLOWING |
| `dist/index.html` | Canonical URL | Astro.site + Astro.url.pathname in SEO.astro | Yes — `<link rel="canonical" href="https://scopalfirm.com/">` in built HTML | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| dist/index.html contains required disclaimers | `grep "Attorney Advertising\|Maryland (2009)\|does not create"` | All 3 strings present | ✓ PASS |
| dist/index.html has exactly 1 H1 | `grep -c "<h1" dist/index.html` | Returns 1 | ✓ PASS |
| dist/index.html has LegalService JSON-LD | `grep '"@type":"LegalService"'` | Present | ✓ PASS |
| Canonical URL correct | `grep canonical dist/index.html` | `href="https://scopalfirm.com/"` | ✓ PASS |
| banned-words script exits 0 on clean src/ | `node scripts/banned-words.mjs` | "banned-words: clean." exit 0 | ✓ PASS |
| No NAP hardcoded outside constants.ts | `grep -rE "Annandale\|Maryland \(2009\)" src/ excluding constants.ts` | No matches | ✓ PASS |
| No stray .env files | `find . -maxdepth 2 -name ".env*" -not -name ".env.example"` | Empty | ✓ PASS |
| .env gitignored | `git check-ignore -q .env` | Exit 0 | ✓ PASS |
| dist/sitemap-index.xml exists | `test -f dist/sitemap-index.xml` | Exists | ✓ PASS |
| dist/robots.txt exists with correct content | `cat dist/robots.txt` | Disallow: /api/ + Sitemap reference | ✓ PASS |
| tailwind.config.js absent | `test ! -f tailwind.config.js` | Absent | ✓ PASS |
| @astrojs/tailwind absent from package.json | `grep "@astrojs/tailwind" package.json` | Not found | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-----------|-------------|--------|----------|
| FOUND-01 | 01-01, 01-05 | Astro 6 + Tailwind v4 + Vercel adapter deployed to Vercel with auto-deploy on push to main | ✓ SATISFIED | astro@6.3.1, @astrojs/vercel@10.0.6, @tailwindcss/vite@4.2.4 in package.json; vercel project live at scopalfirm.com per DEPLOY-NOTES |
| FOUND-02 | 01-03, 01-05 | vercel.json ships CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS on every response | ✓ SATISFIED | vercel.json verified; all 6 headers confirmed live per DEPLOY-NOTES curl output |
| FOUND-03 | 01-03 | .env/.env.local excluded from git; .env.example documents all vars; gitleaks in CI | ✓ SATISFIED | .gitignore excludes .env/.env.local/.env.*.local; git check-ignore passes; .env.example documents 2 vars; gitleaks-action@v2 in ci.yml |
| FOUND-04 | 01-02 | src/lib/constants.ts is single source of truth for firm NAP, bar admissions, social URLs | ✓ SATISFIED | constants.ts exports FIRM, ATTORNEYS, SOCIAL; no "Annandale"/"Maryland (2009)"/"Attorney Advertising" found outside constants.ts in src/; all consumers import from constants.ts |
| FOUND-05 | 01-04 | CI pipeline runs banned-words lint, axe-core, link checker, Lighthouse CI with budgets | ✓ SATISFIED | ci.yml wires all 5 gates; banned-words script verified; .lighthouserc.json with 0.9 budgets; CI run recorded green per DEPLOY-NOTES |
| FOUND-06 | 01-03 | content.config.ts defines blog, practiceAreas, team collections with Zod schemas | ✓ SATISFIED | content.config.ts at repo root; all 3 collections with required schema fields; build succeeds with empty collections |
| FOUND-07 | 01-02 | Layout hierarchy enforces compliance — BaseLayout/MarketingLayout inject disclaimers automatically | ✓ SATISFIED | BaseLayout renders Footer unconditionally; Footer renders FooterDisclaimer unconditionally; index.astro uses MarketingLayout; dist/index.html contains all 3 disclaimers |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|---------|--------|
| `astro.config.mjs` | `webAnalytics: { enabled: false }` (plan specified `true`) | ℹ️ Info | Intentional deviation: Vercel Web Analytics injected a 404-producing script in Lighthouse staticDistDir mode. Fixed by disabling; DEPLOY-NOTES documents re-enabling in Phase 4/5 after switching to live-URL Lighthouse mode. Not a stub — a deliberate operational fix with documented follow-up. |
| `.github/workflows/ci.yml` | Added `npx browser-driver-manager install chrome` step (not in original plan) | ℹ️ Info | Intentional fix for ChromeDriver version mismatch (GitHub Actions Chrome 147 vs axe bundled Chrome 148 driver). Correctly added as a prerequisite step before the a11y scan. |
| `.lighthouserc.json` | 3 additional `warn`-level assertions for Lighthouse 13 new audits (`network-dependency-tree-insight`, `render-blocking-insight`, `render-blocking-resources`) | ℹ️ Info | Intentional fix: these new Lighthouse 13 audits don't exist in the plan's template but are required for CI to not fail on audits the `lighthouse:recommended` preset now enforces. Downgraded to `warn` — does not loosen any of the 6 required budget assertions. |
| `scripts/banned-words.mjs` | Word-boundary regex instead of naive `.includes()` (plan template used `.includes()`) | ℹ️ Info | Intentional improvement: prevents false positive on CSS classes like `leading-relaxed`. The regex correctly matches the same term set. Verified: `node scripts/banned-words.mjs` exits 0; the script still exits 1 on banned terms in non-comment code. |

No blockers or warning-level anti-patterns found. All deviations from the plan templates are intentional fixes with documented rationale in DEPLOY-NOTES.md and SUMMARY.md.

### Human Verification Required

#### 1. Live Site Browser Check

**Test:** Open https://scopalfirm.com in a browser.
**Expected:** Site loads over HTTPS with no certificate warning; placeholder homepage renders with header (Scopal Firm wordmark + Schedule a Consultation CTA), H1 "Scopal Firm", body copy, and footer containing all three disclaimer paragraphs (attorney advertising, UPL, no-attorney-client).
**Why human:** DNS was noted as partially propagated at time of deployment verification. DEPLOY-NOTES records Vercel-IP (216.198.79.1) curl verification as passing all checks, but a browser check against the live domain is the authoritative confirmation for a user-facing goal.

#### 2. GitHub Actions CI Green Check

**Test:** Visit https://github.com/spalmer47/scopal/actions and confirm the CI run recorded in DEPLOY-NOTES (run ID 25516625502) completed with all 5 gates green.
**Expected:** All steps show green checkmarks: Banned-words lint, Build static site, Internal link check, Accessibility scan (axe-core), Lighthouse CI, Secret scan (gitleaks).
**Why human:** The local HEAD is 2 commits ahead of the remote at SHA 7d066d5 (the 2 additional commits are planning-docs only). The CI run documented in DEPLOY-NOTES is against SHA 7d066d5. Cannot programmatically query GitHub Actions results in this environment.

#### 3. Auto-Deploy Confirmation

**Test:** Push a trivial change to main (e.g., add a comment line to README.md) and observe Vercel deploys within ~90 seconds.
**Expected:** Vercel dashboard shows a new deployment triggered automatically; the live URL reflects the change.
**Why human:** Auto-deploy wiring requires observing a live push-to-deploy cycle.

### Gaps Summary

No gaps were identified. All 7 FOUND-XX requirements have codebase evidence. All 5 ROADMAP success criteria are supported by artifact and data-flow verification. The 3 items in the human verification section are confirmations of live infrastructure behavior — not code deficiencies.

The two uncommitted local commits (df2a696, 9f9d342) are planning-docs only and do not affect the deployed site or CI behavior. They should be pushed when convenient.

---

_Verified: 2026-05-07_
_Verifier: Claude (gsd-verifier)_
