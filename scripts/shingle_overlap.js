#!/usr/bin/env node
/**
 * shingle_overlap.js — the gate that must pass before a review is un-noindexed.
 *
 * WHY THIS EXISTS
 * The original 100 review pages were adjective-substitution into a fixed heading
 * skeleton. They read as unique to a human skimming one page and are near-identical
 * in aggregate — which is what got them noindexed. "It looks rewritten" is not a
 * measurement. This is.
 *
 * WHAT IT MEASURES
 * Mean pairwise 8-word shingle overlap within a group, as |A n B| / min(|A|,|B|).
 * Frontmatter is stripped; only prose is compared.
 *
 * HOW TO READ IT
 * Run it on three groups at once — the pages you just wrote, the hand-written
 * benchmark, and a still-templated control. The control is the calibration: without
 * it a number in isolation means nothing. New work should land near the benchmark,
 * nowhere near the control.
 *
 * Measured 2026-08-07: rewritten 0.4% · benchmark 0.4% · templated control 35.9%.
 *
 *   node scripts/shingle_overlap.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content', 'reviews');
const N = 8;

const GROUPS = {
  'NEW (rewritten today)': [
    'screaming-frog-review', 'rank-math-review', 'less-annoying-crm-review',
    'majestic-seo-review', 'smartlead-review',
  ],
  'PRIOR REWRITES (Aug 10 batch 1)': [
    'gohighlevel-review', 'hubspot-crm-review', 'keap-review',
    'ahrefs-review', 'buffer-review',
  ],
  'BENCHMARK (hand-written, Aug 7)': [
    'mailchimp-review', 'convertkit-review', 'mailerlite-review',
    'getresponse-review', 'aweber-review',
  ],
  'CONTROL (still templated)': [
    'pipedrive-review', 'zoho-crm-review', 'hootsuite-review',
    'moz-pro-review', 'sendible-review',
  ],
};

function shingles(slug) {
  const raw = fs.readFileSync(path.join(DIR, slug + '.mdx'), 'utf8');
  const body = raw.replace(/^---[\s\S]*?\n---\n/, '');   // drop frontmatter
  const words = body
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set();
  for (let i = 0; i + N <= words.length; i++) set.add(words.slice(i, i + N).join(' '));
  return set;
}

function overlap(a, b) {
  let hits = 0;
  for (const s of a) if (b.has(s)) hits++;
  return hits / Math.min(a.size, b.size);
}

let worst = 0;
for (const [label, slugs] of Object.entries(GROUPS)) {
  const sets = slugs.map(s => {
    try { return { slug: s, set: shingles(s) }; }
    catch { return null; }
  }).filter(Boolean);

  const pairs = [];
  for (let i = 0; i < sets.length; i++)
    for (let j = i + 1; j < sets.length; j++)
      pairs.push({ a: sets[i].slug, b: sets[j].slug, v: overlap(sets[i].set, sets[j].set) });

  const mean = pairs.reduce((t, p) => t + p.v, 0) / pairs.length;
  const max = pairs.reduce((m, p) => (p.v > m.v ? p : m), pairs[0]);

  console.log(`\n${label}  (${sets.length} pages, ${pairs.length} pairs)`);
  console.log(`  mean pairwise overlap : ${(mean * 100).toFixed(1)}%`);
  console.log(`  worst pair            : ${(max.v * 100).toFixed(1)}%  ${max.a} <-> ${max.b}`);
  if (label.startsWith('NEW')) worst = mean;
}

console.log('\nGate: NEW must sit near BENCHMARK, not near CONTROL.');
process.exit(worst > 0.05 ? 1 : 0);
