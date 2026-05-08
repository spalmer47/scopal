# 03-02 Execution Summary

**Plan:** Wave 1b — Practice Area Pages
**Commit:** 23e8890
**Status:** Complete ✓

## Files Created/Modified

| File | Action | Notes |
|------|--------|-------|
| `src/content.config.ts` | Moved from `content.config.ts` (root) | Bug fix: Astro 6 searches `srcDir`, not root |
| `src/pages/practice-areas/[slug].astro` | Created | Dynamic routing; uses `entry.id` (not deprecated `entry.slug`) |
| `src/content/practice-areas/fractional-general-counsel.mdx` | Created | 800+ words, 5 FAQs, order: 1 |
| `src/content/practice-areas/corporate-law.mdx` | Created | 800+ words, 5 FAQs, order: 2 |

## Bug Found and Fixed

**content.config.ts was at the wrong path.** The file was committed to the repo root (`content.config.ts`) during Phase 1, but Astro 6 searches for the config inside `srcDir` (`src/`). The file needs to be at `src/content.config.ts`. This bug was silent in Phases 1–2 because the collections were empty (no MDX files existed yet). It only surfaced now when the build tried to generate practice area routes and found an empty `DataEntryMap`.

**Fix:** Renamed `content.config.ts` → `src/content.config.ts`. Also corrected `getCollection('practice-areas')` → `getCollection('practiceAreas')` to match the camelCase key in the export.

## Acceptance Criteria — All Pass ✓

- `[slug].astro` uses `entry.id` (not `entry.slug`)
- Both MDX files have all required frontmatter fields (title, shortTitle, description, order, faqs)
- Both MDX files have 3–5 FAQ entries each
- Both files link to `/attorneys/scott-palmer`, `/pricing`, `/contact`
- Pricing: `$995/month` only — no `$4,500` reference
- `npm run banned-words` → clean
- `npm run build` → 4 pages, 0 errors
- `dist/practice-areas/corporate-law/index.html` ✓
- `dist/practice-areas/fractional-general-counsel/index.html` ✓
