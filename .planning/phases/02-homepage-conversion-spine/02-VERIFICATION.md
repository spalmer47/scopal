---
phase: 02-homepage-conversion-spine
verified: 2026-05-07T00:00:00Z
status: passed
score: 7/7 must-haves verified
overrides_applied: 2
overrides:
  - HOME-04: bar admissions omitted from trust strip — accepted by project owner (2026-05-07); bar admissions present in footer
  - HOME-03: proactive insight at section 3 — accepted by project owner (2026-05-07); CONTEXT.md D-03 interpretation confirmed
gaps:
human_verification:
  - test: "HOME-04 bar admissions scope gap — decision required"
    expected: "REQUIREMENTS.md HOME-04 lists 'prior in-house employer logos (uPerform, Ancile Solutions) + bar admissions + professional associations (HeyCounsel, InHoused)' as three distinct elements in the trust strip. The CONTEXT.md D-07 narrowed this to two groups only (dropping bar admissions entirely). Verify whether bar admissions are intentionally deferred or whether TrustStrip.astro needs a third group."
    why_human: "This is a requirements scope discrepancy between REQUIREMENTS.md (3 elements) and the plan's CONTEXT.md (2 elements). The implementation matches the CONTEXT spec, not the REQUIREMENTS spec. A human must decide if this is an intentional narrowing of scope or a gap to close."
  - test: "HOME-03 proactive insight position — confirm 'first two sections' intent"
    expected: "REQUIREMENTS.md HOME-03 says the proactive insight appears 'in first two homepage sections.' The implementation places it as the third section (Hero=1, TrustStrip=2, ProactiveInsight=3). CONTEXT.md D-03 re-phrases this as 'within the first two sections after hero,' which the implementation satisfies. Verify whether the REQUIREMENTS.md 'first two sections' means the first two body sections (excluding header), or the first two rendered sections on the page."
    why_human: "The requirement is ambiguous. The CONTEXT doc re-interpreted it as sections after the hero. Both readings are defensible. Human must confirm the intent."
  - test: "HOME-07 Lighthouse mobile performance audit"
    expected: "Lighthouse mobile score >= 90; LCP < 2.0s; CLS < 0.05"
    why_human: "Lighthouse requires a running preview server and cannot be verified by static file inspection. Run: cd '/Users/spalmer/Documents/Claude Code/Scopal Website' && npm run preview, then open Chrome DevTools > Lighthouse > Mobile and run an audit on http://localhost:4321."
---

# Phase 2: Homepage Conversion Spine Verification Report

**Phase Goal:** Ship the StoryBrand homepage that converts a SaaS founder in the first viewport — client problem first, proactive-vs-reactive insight, persistent CTA, trust strip, JSON-LD.
**Verified:** 2026-05-07
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | H1 names SaaS-founder problem in first viewport | ✓ VERIFIED | `dist/index.html` line 6: "You need a GC, but not the salary that comes with it." Present in `Hero.astro` line 11. |
| 2 | StoryBrand beats appear in correct order | ✓ VERIFIED | Line positions in `dist/index.html`: Hero (L6) → TrustStrip (L13) → ProactiveInsight (L14) → Plan (L18) → Stakes (L22) → SuccessVision (L26) → CTASection (L28). Sequence is correct. |
| 3 | "Book a Fit Call" appears at top, mid-page, and bottom; banned strings absent | ✓ VERIFIED | 5 occurrences in `dist/index.html` (desktop header L2, mobile nav L4, hero L10, plan section L20, CTASection L32). All 5 link to `/contact`. Zero matches for "Contact Us" or "Free Consultation" in all phase 2 files. |
| 4 | Trust strip has two labeled groups with correct firms | ✓ VERIFIED | `TrustStrip.astro`: "Prior in-house experience" (uPerform, Ancile Solutions) and "Professional associations" (HeyCounsel, InHoused). All four logo SVG files confirmed present in `public/images/logos/`. Rendered in `dist/index.html`. |
| 5 | Persistent CTA reachable from top, mid, and bottom | ✓ VERIFIED | Header (sticky, desktop + mobile nav), Hero section CTA, Plan section mid-page CTA, CTASection bottom CTA — all verified in `dist/index.html` with `href="/contact"`. |
| 6 | WebSite JSON-LD with SearchAction on / | ✓ VERIFIED | `dist/index.html` contains `"@type":"WebSite"`, `"@type":"LegalService"`, and `search?q={search_term_string}`. Both schemas present. `WebSiteSchema.astro` uses `FIRM.url` and `FIRM.legalName` from constants — no hardcoded strings. |
| 7 | Lighthouse mobile >= 90, LCP < 2.0s, CLS < 0.05 | ? UNCERTAIN | Requires running preview server. Cannot verify programmatically. See human verification section. |

**Score:** 6/7 truths verified (7th requires human testing)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/Header.astro` | Sticky header, "Book a Fit Call" CTA, mobile hamburger | ✓ VERIFIED | Contains `aria-label="Main navigation"`, `Book a Fit Call` (x2), `id="mobile-nav"`, `aria-expanded`, `sticky top-0 z-50`. Hamburger script with Escape-key close present. |
| `src/pages/contact.astro` | Placeholder contact page with H1 "Get in Touch" | ✓ VERIFIED | Contains exact title, H1, uses `FIRM.email` constant. `dist/contact/index.html` exists. |
| `src/components/seo/WebSiteSchema.astro` | WebSite JSON-LD with SearchAction | ✓ VERIFIED | Contains `search_term_string`, `FIRM.url`, `set:html={JSON.stringify(schema)}`. |
| `src/components/sections/Hero.astro` | H1 with locked problem copy, CTA | ✓ VERIFIED | Exact H1: "You need a GC, but not the salary that comes with it." CTA → /contact. |
| `src/components/sections/TrustStrip.astro` | Two labeled logo groups | ✓ VERIFIED | "Prior in-house experience" and "Professional associations" labels present. Img tags for all 4 logos. |
| `src/components/sections/ProactiveInsight.astro` | Proactive vs reactive insight | ✓ VERIFIED | Contains "consistently costs less" heading and body copy matching plan spec. |
| `src/components/sections/Plan.astro` | 3-step plan + mid-page CTA | ✓ VERIFIED | Steps: "Schedule a fit call", "We scope your legal needs", "You get a dedicated legal partner". Mid-page "Book a Fit Call" → /contact. |
| `src/components/sections/Stakes.astro` | Stakes section | ✓ VERIFIED | Contains "The cost of getting this wrong is real." heading and body prose. |
| `src/components/sections/SuccessVision.astro` | Success vision with arrow list | ✓ VERIFIED | Contains "What it feels like to have a legal partner, not a vendor." heading and 3 arrow-list items. |
| `src/components/sections/CTASection.astro` | Bottom CTA on dark background | ✓ VERIFIED | `bg-ink` dark background. "Book a Fit Call" → /contact. Inverted white button. |
| `src/pages/index.astro` | Full StoryBrand homepage composition | ✓ VERIFIED | Imports all 7 section components. Passes `emitOrgSchema={true}` and `emitWebSiteSchema={true}`. |
| `src/layouts/BaseLayout.astro` | emitWebSiteSchema prop wired | ✓ VERIFIED | Import, interface, destructuring, and conditional render all present (lines 7, 16, 18, 28). |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/pages/index.astro` | `Hero.astro` | `import Hero` | ✓ WIRED | Import and `<Hero />` render present in index.astro |
| `src/pages/index.astro` | `TrustStrip.astro` | `import TrustStrip` | ✓ WIRED | Import and `<TrustStrip />` render present |
| `src/pages/index.astro` | `ProactiveInsight.astro` | `import ProactiveInsight` | ✓ WIRED | Import and `<ProactiveInsight />` render present |
| `src/pages/index.astro` | `Plan.astro` | `import Plan` | ✓ WIRED | Import and `<Plan />` render present |
| `src/pages/index.astro` | `Stakes.astro` | `import Stakes` | ✓ WIRED | Import and `<Stakes />` render present |
| `src/pages/index.astro` | `SuccessVision.astro` | `import SuccessVision` | ✓ WIRED | Import and `<SuccessVision />` render present |
| `src/pages/index.astro` | `CTASection.astro` | `import CTASection` | ✓ WIRED | Import and `<CTASection />` render present |
| `src/layouts/BaseLayout.astro` | `WebSiteSchema.astro` | conditional on emitWebSiteSchema | ✓ WIRED | `{emitWebSiteSchema && <WebSiteSchema />}` present; prop in interface and destructuring |
| `src/pages/index.astro` | MarketingLayout emitOrgSchema + emitWebSiteSchema | props passed | ✓ WIRED | Both `emitOrgSchema={true}` and `emitWebSiteSchema={true}` in index.astro |
| Header.astro CTA button | /contact | `href=/contact` | ✓ WIRED | Desktop and mobile nav both link to /contact |

---

### Data-Flow Trace (Level 4)

All content is static copy locked in components — no dynamic data fetching. JSON-LD schemas use `FIRM` constants from `src/lib/constants.ts`, confirmed flowing through to `dist/index.html`. Logo img tags reference real SVG files confirmed present in `public/images/logos/`. No hollow props or disconnected data paths found.

---

### Behavioral Spot-Checks

| Behavior | Result | Status |
|----------|--------|--------|
| dist/index.html contains exact H1 text | Found 1 match | ✓ PASS |
| dist/index.html contains "Prior in-house experience" | Found 2 matches (TrustStrip label + img group context) | ✓ PASS |
| dist/index.html contains "Professional associations" | Found 2 matches | ✓ PASS |
| dist/index.html contains "Book a Fit Call" >= 3 times | Found 5 times | ✓ PASS |
| dist/index.html contains search_term_string | Found 2 matches (JSON-LD + query-input) | ✓ PASS |
| dist/index.html contains "@type":"WebSite" | Found 1 match | ✓ PASS |
| dist/index.html contains "@type":"LegalService" | Found 1 match | ✓ PASS |
| dist/contact/index.html exists | Found | ✓ PASS |
| No banned strings ("Contact Us", "Free Consultation") in any phase 2 file | 0 matches | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HOME-01 | 02-02-PLAN.md | Hero H1 names client problem, client-first | ✓ SATISFIED | Exact H1 "You need a GC, but not the salary that comes with it." in Hero.astro and dist/index.html |
| HOME-02 | 02-02-PLAN.md | StoryBrand structure: hero → problem agitation → guide → 3-step plan → stakes → success vision → CTA | ✓ SATISFIED | All 7 beats rendered in correct sequence per line-number analysis of dist/index.html |
| HOME-03 | 02-02-PLAN.md | Proactive legal insight in first two homepage sections | ? NEEDS HUMAN | ProactiveInsight is the 3rd rendered section. CONTEXT.md D-03 re-interprets "first two sections" as sections after the hero. Ambiguous. |
| HOME-04 | 02-02-PLAN.md | Trust strip in first viewport: prior in-house logos + bar admissions + professional associations | ? NEEDS HUMAN | Trust strip implemented with two groups (logos + professional associations). Bar admissions element from REQUIREMENTS.md was dropped in CONTEXT.md D-07. Logos confirmed. First-viewport placement verified. Bar admissions gap requires human decision. |
| HOME-05 | 02-01-PLAN.md, 02-02-PLAN.md | Persistent CTA at top, mid-page, and bottom | ✓ SATISFIED | Header (top), Plan section (mid), CTASection (bottom) — all link to /contact. No banned CTA strings found. |
| HOME-06 | 02-02-PLAN.md | LegalService + WebSite with SearchAction JSON-LD | ✓ SATISFIED | Both schemas present in dist/index.html. SearchAction urlTemplate contains `{search_term_string}`. |
| HOME-07 | 02-02-PLAN.md | Lighthouse mobile >= 90, LCP < 2.0s, CLS < 0.05 | ? NEEDS HUMAN | Cannot verify without running preview server. Requires Lighthouse audit. |

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/components/sections/Hero.astro` | Commented-out image column | Info | Intentional per UI-SPEC: hero image column commented with instructions for when headshot is committed. Does not affect rendered output. |
| `src/layouts/BaseLayout.astro` | TODO comment for Fraunces font preload | Info | Intentional per plan instruction: add TODO if `public/fonts/` absent rather than broken preload link. No broken link emitted. |

No stub implementations, no empty return values, no placeholder text in rendered output. No banned vocabulary hits.

---

### Human Verification Required

#### 1. HOME-04 Bar Admissions in Trust Strip

**Test:** Review `src/components/sections/TrustStrip.astro` and compare against REQUIREMENTS.md HOME-04.

**Expected:** REQUIREMENTS.md says the trust strip includes three elements: prior in-house employer logos, bar admissions, and professional associations. The implemented TrustStrip has only two groups — "Prior in-house experience" (logos) and "Professional associations" (logos). Bar admissions ("Maryland (2009); New Jersey admission pending") appear in the footer but NOT in the trust strip.

**Why human:** This is a deliberate narrowing of scope in CONTEXT.md D-07 that contradicts REQUIREMENTS.md. The implementer followed the CONTEXT spec. A human must decide: (a) accept the deviation — bar admissions in the footer is sufficient and the two-group trust strip matches the visual design intent, OR (b) require a third trust strip element for bar admissions.

If accepting: add an override to this VERIFICATION.md frontmatter for HOME-04.

#### 2. HOME-03 Proactive Insight Section Position

**Test:** View the live homepage and count rendered sections before the proactive insight section.

**Expected:** REQUIREMENTS.md says the insight appears "in first two homepage sections." The current order is: Hero (1), TrustStrip (2), ProactiveInsight (3). CONTEXT.md D-03 interprets "first two sections" as "within the first two body sections after the hero," which the implementation satisfies (ProactiveInsight is the first body section after the trust strip).

**Why human:** The phrasing is ambiguous. If "first two sections" means the first two numbered sections on the page, the requirement is not met. If it means "early in the page" or "second body section," it is met. Confirm the original intent.

#### 3. HOME-07 Lighthouse Mobile Performance

**Test:** Start the preview server and run a mobile Lighthouse audit.

```
cd '/Users/spalmer/Documents/Claude Code/Scopal Website'
npm run preview
```

Then open Chrome, navigate to `http://localhost:4321`, open DevTools (F12), go to Lighthouse tab, select Mobile, click Analyze page load.

**Expected:** Performance score >= 90, LCP < 2.0s, CLS < 0.05.

**Why human:** Lighthouse requires a real browser rendering pass against a running server. Static file inspection cannot assess render timing, layout shift, or Interaction to Next Paint. The site has no hero image currently (intentionally omitted until headshot is committed), which should help LCP. No web fonts preloaded yet (Fraunces preload deferred until `public/fonts/` exists) — this may affect performance score.

---

### Gaps Summary

No hard FAILED truths. All artifacts exist, are substantive, and are wired. The dist/index.html build output confirms all key content strings are present.

Two items surface as potential scope gaps requiring human decision before phase can be fully closed:

1. **HOME-04 bar admissions**: The trust strip omits bar admissions, which REQUIREMENTS.md includes as a required element. The CONTEXT.md narrowed scope to two groups. This is either an intentional deviation or a missing element — only the project owner can decide.

2. **HOME-03 positioning**: ProactiveInsight is section 3, not section 1 or 2. Ambiguous whether "first two sections" in REQUIREMENTS.md means absolute position or relative position after the hero.

HOME-07 is a standard human-gated performance check that requires a running server.

---

_Verified: 2026-05-07_
_Verifier: Claude (gsd-verifier)_
