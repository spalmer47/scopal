---
phase: "04-lead-capture-content-launch-hardening"
plan: "04-01"
subsystem: "blog"
tags: [blog, rss, seo, article-schema, navigation]
dependency_graph:
  requires: ["04-00"]
  provides: ["blog-system", "rss-feed", "article-schema"]
  affects: ["header-nav", "seo"]
tech_stack:
  added: ["@astrojs/rss"]
  patterns: ["BlogPostLayout wrapping MarketingLayout", "Article JSON-LD via ArticleSchema component", "Astro 6 post.id routing"]
key_files:
  created:
    - src/components/seo/ArticleSchema.astro
    - src/layouts/BlogPostLayout.astro
    - src/pages/blog/[...page].astro
    - src/pages/blog/[slug].astro
    - src/pages/rss.xml.js
  modified:
    - src/components/layout/Header.astro
decisions:
  - "Used post.id (not post.slug) for all blog routing — Astro 6 removes .slug property"
  - "Installed @astrojs/rss — it was not in package.json despite plan asserting it was already installed"
  - "ogType and ogImage props were already supported by MarketingLayout — no changes needed there"
metrics:
  duration: "~4 minutes"
  completed_date: "2026-05-08"
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 1
---

# Phase 4 Plan 01: Blog System Summary

Complete blog infrastructure delivering paginated index, individual post routes, RSS feed, ArticleSchema JSON-LD, and Header Blog nav link — all posts auto-receive DisclaimerCallout, breadcrumbs, ArticleSchema, and CTASection via BlogPostLayout.

## Build Results

- `npm run banned-words`: clean
- `npm run build`: passed — 14 pages built
- `dist/blog/` directory: exists with 2 entries (index.html + when-saas-needs-a-lawyer/)
- `dist/blog/` file count from `ls dist/blog/ | wc -l`: **2**
- `dist/rss.xml`: exists
- `Header.astro` occurrences of `href="/blog"`: **2** (desktop nav + mobile nav)

## Tasks Completed

### Task 1: ArticleSchema component + BlogPostLayout

**ArticleSchema.astro** (`src/components/seo/ArticleSchema.astro`):
- Modeled on ServiceSchema.astro — same `set:html={JSON.stringify(schema)}` emit pattern
- Imports FIRM from constants for publisher name/url
- Emits Article JSON-LD with headline, description, datePublished, dateModified, author (Scott A. Palmer), publisher, mainEntityOfPage

**BlogPostLayout.astro** (`src/layouts/BlogPostLayout.astro`):
- Modeled on PracticeAreaLayout.astro — same slot structure and DisclaimerCallout placement
- Auto-injects: ArticleSchema, BreadcrumbSchema (Home > Blog > post title), DisclaimerCallout, CTASection
- Passes `ogType="article"` to MarketingLayout (which already supported this prop)
- Breadcrumb pattern: `[Home /, Blog /blog, {title} /blog/{slug}]`

### Task 2: Blog index, post route, RSS feed, Header Blog nav

**Blog index** (`src/pages/blog/[...page].astro`):
- `getCollection('blog', ({ data }) => !data.draft)` — draft filter applied
- `paginate(sorted, { pageSize: 10 })` — pagination configured
- Post links use `post.id` (Astro 6 compliant — no `.slug`)
- Empty state message: "No posts yet. Check back soon."
- Pagination nav with prev/next links

**Blog post route** (`src/pages/blog/[slug].astro`):
- `getStaticPaths` maps `params: { slug: post.id }` — Astro 6 pattern
- Draft filter applied in getStaticPaths
- Renders via BlogPostLayout with all required props including ogImage from heroImage

**RSS feed** (`src/pages/rss.xml.js`):
- `export async function GET(context)` — correct Astro 6 endpoint pattern
- Draft filter applied
- Uses `FIRM.legalName` in feed title
- `context.site` for absolute URL base

**Header update** (`src/components/layout/Header.astro`):
- Blog link added after Pricing in desktop nav (line 55)
- Blog link added after Pricing in mobile nav (line 105)
- 2 occurrences of `href="/blog"` confirmed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @astrojs/rss not installed**
- **Found during:** Task 2 (npm run build failed with "Rollup failed to resolve import @astrojs/rss")
- **Issue:** Plan stated "@astrojs/rss is already installed at version 4.0.18" but the package was not present in node_modules or package.json
- **Fix:** Ran `npm install @astrojs/rss` — installed successfully, build then passed
- **Files modified:** package.json, package-lock.json
- **Commit:** e8932fe

## Known Stubs

None — the first blog post (`when-saas-needs-a-lawyer`) renders fully at `/blog/when-saas-needs-a-lawyer/` with all injected components.

## Threat Flags

None — all new surface (RSS feed, blog routes) is static generation with no user input. Covered by existing threat model T-04-01-01 through T-04-01-03 in the plan.

## Self-Check: PASSED

- `src/components/seo/ArticleSchema.astro`: exists
- `src/layouts/BlogPostLayout.astro`: exists
- `src/pages/blog/[...page].astro`: exists
- `src/pages/blog/[slug].astro`: exists
- `src/pages/rss.xml.js`: exists
- `dist/blog/index.html`: exists (from build)
- `dist/blog/when-saas-needs-a-lawyer/index.html`: exists (from build)
- `dist/rss.xml`: exists
- Commit e8932fe: all 14 files in this plan present in git show --stat
