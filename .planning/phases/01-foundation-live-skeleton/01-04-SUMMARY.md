---
phase: 01-foundation-live-skeleton
plan: "04"
subsystem: infra
tags: [github-actions, ci, lighthouse, axe-core, gitleaks, linkinator, banned-words]

dependency_graph:
  requires:
    - phase: 01-foundation-live-skeleton
      provides: astro-6-scaffold
    - phase: 01-foundation-live-skeleton
      provides: src/lib/constants.ts BANNED_TERMS
  provides:
    - github-actions-ci-workflow
    - banned-words-lint-script
    - lighthouse-ci-budget-config
    - npm-scripts-banned-words-linkcheck-a11y
  affects:
    - all-future-plans
    - 01-05-deploy

tech-stack:
  added:
    - "@axe-core/cli@^4.11.3"
    - "linkinator@^7.6.1"
    - "@lhci/cli@^0.15.1"
    - "start-server-and-test@^2.1.5"
  patterns:
    - "GitHub Actions five-check merge gate (banned-words → build → linkcheck → a11y → lhci → gitleaks)"
    - "Word-boundary regex for content linting to avoid CSS class false positives"
    - "start-server-and-test for reliable CI server startup vs. background-process-with-sleep"
    - "Lighthouse CI staticDistDir mode with 3-run averaging"

key-files:
  created:
    - scripts/banned-words.mjs
    - .lighthouserc.json
    - .github/workflows/ci.yml
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Word-boundary regex in banned-words.mjs to prevent Tailwind class false positives (leading-relaxed does not match leading)"
  - "start-server-and-test used for a11y step instead of background-process-with-sleep for CI reliability"
  - "banned-words runs FIRST in CI (fail-fast gate — cheapest check)"
  - "fetch-depth: 0 required for gitleaks full history scan"
  - "permissions: contents: read (least privilege) on CI workflow"
  - "scripts/banned-words.mjs duplicates BANNED_TERMS as plain JS (no tsx dep); sync enforced by acceptance criterion"

patterns-established:
  - "CI merge gates: banned-words → build → linkcheck → a11y → lighthouse → gitleaks (this order)"
  - "banned-words.mjs: skips src/lib/constants.ts (data), skips comment lines (// # *), uses word-boundary regex"
  - "Lighthouse assertions at 0.9 minimum all categories; LCP < 2000ms; CLS < 0.05"

requirements-completed: [FOUND-05]

duration: ~10 minutes
completed: 2026-05-07
---

# Phase 1 Plan 04: Wire Merge-Gate CI Pipeline Summary

**GitHub Actions five-check merge gate with banned-words lint, axe-core a11y, linkinator, gitleaks secret scan, and Lighthouse CI enforcing 0.9 performance budgets on every pull request to main.**

## Performance

- **Duration:** ~10 minutes
- **Started:** 2026-05-07T14:54:00Z
- **Completed:** 2026-05-07T15:00:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- `scripts/banned-words.mjs` walks `src/**/*.{astro,md,mdx,ts}`, catches banned D14 vocabulary with word-boundary matching, skips `src/lib/constants.ts` and comment lines; exits 0 on clean repo, exits 1 with file:line on violation
- `.lighthouserc.json` enforces performance/accessibility/best-practices/SEO ≥ 0.9, LCP < 2000ms, CLS < 0.05 across 3 runs via staticDistDir
- `.github/workflows/ci.yml` orchestrates all five FOUND-05 gates; runs on every PR to main and push to main; uses least-privilege `contents: read` permissions

## BANNED_TERMS Sync Verification

`src/lib/constants.ts` BANNED_TERMS (9 strings):
```
'specialist', 'specializing in', 'expert', 'experts',
'the best', '#1', 'leading', 'top-rated', 'super lawyer'
```

`scripts/banned-words.mjs` BANNED_TERMS (9 strings):
```
'specialist', 'specializing in', 'expert', 'experts',
'the best', '#1', 'leading', 'top-rated', 'super lawyer'
```

Both arrays are identical. Sync confirmed.

## Plant-and-Detect Test Result

```
printf 'export const X = "leading test";\n' > src/_banned-test.ts
npm run banned-words  # → src/_banned-test.ts:1: BANNED TERM "leading" (exit 1)
rm -f src/_banned-test.ts
npm run banned-words  # → banned-words: clean. (exit 0)
```

PASS: banned-words correctly caught and reported the violation.

## Action Major Versions Used (Record for Plan 05 Verification)

| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | `@v4` | Full history via `fetch-depth: 0` |
| `actions/setup-node` | `@v4` | Node 22 LTS, npm cache |
| `treosh/lighthouse-ci-action` | `@v12` | configPath + uploadArtifacts |
| `gitleaks/gitleaks-action` | `@v2` | GITHUB_TOKEN env |

Plan 05 should verify these major versions are still current before the first live PR.

## Task Commits

Each task was committed atomically:

1. **Task 1: banned-words script + npm scripts + dev tooling** - `b8fa65a` (feat)
2. **Task 2: Lighthouse CI budget config** - `589ae3e` (feat)
3. **Task 3: GitHub Actions CI workflow** - `8d4ac80` (feat)

## Files Created/Modified

- `scripts/banned-words.mjs` — Walks src/, flags D14 banned vocabulary with word-boundary regex; skips constants.ts and comment lines
- `.lighthouserc.json` — Lighthouse CI assertion config: 0.9 minimum all four categories, LCP < 2000ms, CLS < 0.05, 3 runs per staticDistDir
- `.github/workflows/ci.yml` — Five-check merge gate: banned-words, build, linkcheck, a11y (start-server-and-test + axe), Lighthouse CI, gitleaks; read-only permissions
- `package.json` — Added scripts: `banned-words`, `linkcheck`, `a11y`; preserved `dev`, `build`, `preview`, `astro`
- `package-lock.json` — Updated with @axe-core/cli, linkinator, @lhci/cli, start-server-and-test

## Decisions Made

1. **Word-boundary regex in banned-words.mjs** — Initial implementation using `.includes()` caused a false positive on `leading-relaxed` (Tailwind CSS utility class). Auto-fixed by switching to a lookbehind/lookahead regex that ignores terms embedded in hyphenated compound words. This means `leading` flags "the leading firm" but not "leading-relaxed". (Rule 1 — Bug.)

2. **start-server-and-test for a11y** — Used `start-server-and-test 'astro preview ...' http://... 'axe ... --exit'` instead of the brittle `astro preview & sleep 3 && axe ...` pattern. CI runners have variable startup times; start-server-and-test polls the URL and only proceeds when the server responds.

3. **banned-words runs first in CI** — Cheapest check runs first (fail-fast gate). If copy contains a banned term, CI fails before spinning up a build, saving ~30s of Actions minutes per PR.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Word-boundary regex to prevent Tailwind class false positives**
- **Found during:** Task 1 verification (`npm run banned-words`)
- **Issue:** The naive `.includes('leading')` check triggered on `leading-relaxed` in `src/pages/index.astro` line 24 (`class="text-base leading-relaxed text-ink mb-xl"`). This is a Tailwind utility class, not authored copy — a false positive that would break CI on clean code.
- **Fix:** Replaced `.includes()` with a word-boundary regex using lookbehind/lookahead: `(?<![\w-])${term}(?![\w-])`. The term must be preceded and followed by a non-word, non-hyphen character. `leading-relaxed` does not match; `"leading firm"` does match.
- **Files modified:** `scripts/banned-words.mjs`
- **Verification:** `leading-relaxed` in a test file exits 0; standalone `"leading test"` in a test file exits 1.
- **Committed in:** b8fa65a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** Essential correctness fix — the false positive would have blocked every PR containing any Tailwind spacing/typography utility. No scope creep; fix is minimal and verifiable.

## Issues Encountered

None beyond the Tailwind class false positive (documented above as Deviation 1).

## Known Stubs

None — all three artifacts are complete implementations, not stubs.

## Threat Flags

None beyond those documented in the plan's threat model (T-01-23 through T-01-31). No new network endpoints, auth paths, or trust boundary changes introduced. The CI workflow runs read-only on GitHub Actions infrastructure.

## Self-Check

- [x] `scripts/banned-words.mjs` exists — FOUND
- [x] `.lighthouserc.json` exists — FOUND
- [x] `.github/workflows/ci.yml` exists — FOUND
- [x] Commit b8fa65a exists — FOUND
- [x] Commit 589ae3e exists — FOUND
- [x] Commit 8d4ac80 exists — FOUND
- [x] `npm run banned-words` exits 0 on current repo — VERIFIED
- [x] Plant-and-detect: exits 1 on `"leading test"` — VERIFIED
- [x] `npm run build` exits 0 — VERIFIED
- [x] `npm run linkcheck` exits 0 — VERIFIED
- [x] `.lighthouserc.json` is valid JSON — VERIFIED
- [x] CI workflow has 4 `uses:` steps and 5 `run:` steps — VERIFIED

## Self-Check: PASSED
