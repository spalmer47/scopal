---
phase: 02-homepage-conversion-spine
plan: 01
subsystem: navigation + routing
tags: [header, nav, mobile, contact, placeholder, cta]
dependency_graph:
  requires: []
  provides: ["/contact route", "sticky header with nav", "Book a Fit Call CTA"]
  affects: [all pages using Header.astro, all CTA buttons linking to /contact]
tech_stack:
  added: []
  patterns: [vanilla JS hamburger toggle, aria-expanded pattern, MarketingLayout usage]
key_files:
  created:
    - src/pages/contact.astro
  modified:
    - src/components/layout/Header.astro
decisions:
  - "Book a Fit Call CTA links to /contact (not mailto:) — all CTAs on site now have a working destination"
  - "Email in contact.astro sourced from FIRM.email constant — never hardcoded"
  - "Hamburger uses vanilla <script> only per D12 (zero JS frameworks in v1)"
metrics:
  duration: "~5 minutes"
  completed_date: "2026-05-07"
  tasks_completed: 2
  files_modified: 2
---

# Phase 2 Plan 01: Header + Contact Placeholder Summary

**One-liner:** Sticky site navigation with three real nav links, a "Book a Fit Call" CTA button, a working mobile hamburger menu, and a placeholder /contact page so every CTA on the site has a destination.

**Plain English for Scott:** This plan updates the navigation bar at the top of every page so it has real links to Practice Areas, your bio, and Pricing — plus a "Book a Fit Call" button that goes to a real /contact page. On phones, a hamburger menu appears that opens and closes with a tap (or the Escape key for accessibility). The /contact page is a placeholder for now: it tells visitors the form is coming and gives them your email address directly.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update Header.astro | 18b08e1 | src/components/layout/Header.astro |
| 2 | Create contact.astro | 381320a | src/pages/contact.astro |

## What Was Built

### Task 1: Header.astro

- Header is now `sticky top-0 z-50` — stays at the top of the page as visitors scroll
- `<nav aria-label="Main navigation">` with three links: Practice Areas, Scott Palmer, Pricing
- "Book a Fit Call" CTA button (primary blue) linking to `/contact` — replaces the Phase 1 `mailto:` link
- Mobile hamburger button (`id="hamburger"`) with `aria-expanded`, `aria-controls="mobile-nav"`, and `aria-label` toggling
- Mobile nav panel (`id="mobile-nav"`) repeats all links and CTA, starts hidden
- Vanilla `<script>` handles toggle + Escape key close (WCAG 2.1 AA)
- No banned strings ("Contact Us", "Free Consultation", "Schedule a Consultation") present

### Task 2: contact.astro

- File: `src/pages/contact.astro` — did not exist before this plan
- Page title: `Contact — Annandale, NJ | Scopal Firm` (exact locked spec)
- H1: `Get in Touch` (exact locked spec per CONTEXT.md D-11)
- mailto link uses `FIRM.email` from constants — email is never hardcoded in the page
- No `emitOrgSchema` — LegalService schema is homepage-only per D8
- Uses `MarketingLayout` — consistent with all marketing pages

## Verification Results

- `npm run build` exits 0
- `dist/contact/index.html` exists in build output
- `npm run banned-words` reports `banned-words: clean`
- All must_haves grep checks pass

## Deviations from Plan

None — plan executed exactly as written. The checkpoint:human-action gate (Task 0) was pre-resolved before execution. Logo files are confirmed present in `public/images/logos/` and will be consumed by Plan 02.

## Known Stubs

- `src/pages/contact.astro` is explicitly a placeholder. The full contact form arrives in Phase 4. The stub is intentional and documented in the plan.

## Threat Surface Scan

No new security surface beyond the plan's threat model. The mailto link is a public email address on a static page (T-02-01, accepted). The hamburger script reads/writes only DOM attributes with no external input (T-02-02, accepted).

## Self-Check: PASSED

- `src/components/layout/Header.astro` — found, contains all required strings
- `src/pages/contact.astro` — found, contains required strings, no banned strings
- `dist/contact/index.html` — found after successful build
- Commits 18b08e1 and 381320a — both present in git log
