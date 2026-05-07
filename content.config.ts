// content.config.ts
// Astro 6 path: repo root (NOT src/content/config.ts which is the legacy Astro 5 location).
// Source: .planning/phases/01-foundation-live-skeleton/01-RESEARCH.md Example C
//
// Phase 1 ships these collections EMPTY (only .gitkeep inside each folder).
// Phase 3 populates practiceAreas and team. Phase 4 populates blog.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.literal('scott-palmer'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const practiceAreas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/practice-areas' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string().max(160),
    order: z.number(),
    icon: z.string().optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    isAttorney: z.boolean(),
    barAdmissions: z.array(z.object({
      state: z.string(),
      year: z.number(),
      status: z.enum(['active', 'pending']),
    })).default([]),
    education: z.array(z.string()).default([]),
    headshot: z.string(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
  }),
});

export const collections = { blog, practiceAreas, team };
