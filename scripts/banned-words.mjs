#!/usr/bin/env node
// scripts/banned-words.mjs
// Greps src/ for vocabulary banned by D14 / FIRM_BRIEF / UI-SPEC.
// Synced with src/lib/constants.ts BANNED_TERMS (acceptance criterion enforces this).
// Exits 1 on any match; 0 if clean.

import { readFileSync, globSync } from 'node:fs';

// KEEP IN SYNC with src/lib/constants.ts BANNED_TERMS.
// Synchronization is enforced by the plan's acceptance criterion.
const BANNED_TERMS = [
  'specialist',
  'specializing in',
  'expert',
  'experts',
  'the best',
  '#1',
  'leading',
  'top-rated',
  'super lawyer',
];

// Files this script DOES NOT scan (they intentionally contain the banned strings as data):
const SKIP_PATHS = new Set([
  'src/lib/constants.ts',
]);

const files = globSync('src/**/*.{astro,md,mdx,ts}');
let hits = 0;

for (const file of files) {
  // Normalize for cross-platform path comparison
  const normalized = file.split('\\').join('/');
  if (SKIP_PATHS.has(normalized)) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((rawLine, i) => {
    // Skip lines that are entirely comments (// ... or # ...).
    // This avoids false positives from explanatory prose in code comments.
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) return;

    const lower = rawLine.toLowerCase();
    for (const term of BANNED_TERMS) {
      // Use word-boundary matching to avoid false positives.
      // e.g., "leading-relaxed" (Tailwind class) must NOT match "leading".
      // We treat word boundaries as: not preceded/followed by a word char or hyphen.
      const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Allow the term to start/end at non-word, non-hyphen character boundaries.
      const pattern = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'i');
      if (pattern.test(lower)) {
        console.error(`${file}:${i + 1}: BANNED TERM "${term}"`);
        hits += 1;
      }
    }
  });
}

if (hits > 0) {
  console.error(`\nbanned-words: ${hits} violation(s) found.`);
  process.exit(1);
}
console.log('banned-words: clean.');
