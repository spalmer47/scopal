# 03-01 Execution Summary

**Plan:** Wave 1a — Infrastructure
**Commit:** 57dd69e
**Status:** Complete ✓

## Files Created/Modified

| File | Action | Notes |
|------|--------|-------|
| `content.config.ts` | Modified | Added `coaching` collection; updated export |
| `src/content/coaching/.gitkeep` | Created | Empty dir placeholder for glob loader |
| `src/components/seo/FAQSchema.astro` | Created | FAQPage JSON-LD; props: `faqs: Array<{q,a}>` |
| `src/components/seo/BreadcrumbSchema.astro` | Created | BreadcrumbList JSON-LD; reads FIRM.url from constants |
| `src/components/seo/PersonSchema.astro` | Created | Person JSON-LD (NOT deprecated Attorney type) |
| `src/components/seo/ServiceSchema.astro` | Created | Service JSON-LD; props: `name`, `description` |
| `src/components/legal/DisclaimerCallout.astro` | Created | Page-level disclaimer; uses FIRM.noAttorneyClientDisclaimer |
| `src/layouts/PracticeAreaLayout.astro` | Created | Auto-injects: DisclaimerCallout, FAQSchema, BreadcrumbSchema, ServiceSchema, CTASection |
| `src/components/layout/Header.astro` | Modified | Practice Areas dropdown + Coaching link; ARIA-accessible |

## Acceptance Criteria — All Pass ✓

- coaching registered in content.config.ts (2 occurrences)
- All 4 schema components follow `set:html={JSON.stringify(schema)}` pattern
- PersonSchema uses `'@type': 'Person'` (not deprecated Attorney)
- DisclaimerCallout uses `FIRM.noAttorneyClientDisclaimer` + `role="note"`
- PracticeAreaLayout wraps MarketingLayout; auto-injects all 5 pieces
- Header desktop: `aria-haspopup`, `aria-expanded`, `id="practice-dropdown"`, Escape key, outside-click close
- Header contains `/practice-areas/corporate-law`, `/practice-areas/fractional-general-counsel`, `/coaching`
- `npm run banned-words` → clean
- `npm run build` → 0 errors, 2 pages built
