---
status: partial
phase: 02-homepage-conversion-spine
source: [02-VERIFICATION.md]
started: 2026-05-07T00:00:00Z
updated: 2026-05-07T00:00:00Z
---

## Current Test

Awaiting human decisions on 3 items.

## Tests

### 1. HOME-04 — Bar admissions in trust strip (scope decision)
expected: REQUIREMENTS.md says the trust strip includes three elements: prior in-house logos, bar admissions, and professional associations. The implementation has two groups only (logos + professional associations). Bar admissions appear in the footer but not the trust strip. Scott must decide: accept the two-group trust strip as-is, or add bar admissions as a third trust strip element.
result: [pending]

### 2. HOME-03 — Proactive insight section position (intent confirmation)
expected: REQUIREMENTS.md says the proactive insight appears "in first two homepage sections." The rendered order is: Hero (1) → TrustStrip (2) → ProactiveInsight (3). CONTEXT.md D-03 interpreted "first two sections" as the first two body sections after the hero, which ProactiveInsight satisfies. Scott must confirm whether section 3 is acceptable or whether the section should move to position 2.
result: [pending]

### 3. HOME-07 — Lighthouse mobile performance audit
expected: Lighthouse mobile Performance >= 90, LCP < 2.0s, CLS < 0.05
how to test: Run `npm run preview` in your terminal, then open Chrome → http://localhost:4321 → DevTools (F12) → Lighthouse tab → Mobile → Analyze page load
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
