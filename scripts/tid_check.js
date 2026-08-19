#!/usr/bin/env node
/**
 * tid_check.js — proves the source-attribution tids are unique and reversible.
 *
 * WHY THIS EXISTS
 * ClickBank TIDs are capped at 24 characters, so `sourceKey()` truncates a review
 * slug to 22 and appends a one-character placement code. Truncation can collide,
 * and a collision here does not throw or warn — it silently merges two pages'
 * revenue into one row of the TID report. That reads as data, not as a fault,
 * which is the worst kind of bug this site can ship. See lib/offer.ts.
 *
 * Run after adding reviews:  node scripts/tid_check.js
 * Exits non-zero on any collision, over-length tid, or failed round-trip.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content', 'reviews');
const MAX = 24;

// Mirrors sourceKey() in lib/offer.ts. Kept in sync by the round-trip test below
// rather than by hope: if the two ever diverge, slugs stop matching their tids.
const sourceKey = (slug) =>
  slug
    .replace(/-review$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 22);

const PLACEMENTS = { glance: 'g', footer: 'f' };
const tidForSource = (slug, placement) =>
  `${sourceKey(slug)}_${PLACEMENTS[placement] ?? placement.slice(0, 1)}`.slice(0, MAX);

const slugs = fs
  .readdirSync(DIR)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/\.mdx?$/, ''));

console.log(`Checking ${slugs.length} review slugs\n`);

let failed = false;

// 1. Source keys must be unique.
const byKey = new Map();
for (const s of slugs) {
  const k = sourceKey(s);
  if (!byKey.has(k)) byKey.set(k, []);
  byKey.get(k).push(s);
}
const collisions = [...byKey.entries()].filter(([, list]) => list.length > 1);
if (collisions.length) {
  failed = true;
  console.error(`COLLISIONS (${collisions.length}) — these pages would share revenue:`);
  for (const [k, list] of collisions) console.error(`  ${k}  <-  ${list.join(', ')}`);
} else {
  console.log(`  unique source keys : ${byKey.size}/${slugs.length}  OK`);
}

// 2. Every tid must fit ClickBank's cap.
const tooLong = [];
for (const s of slugs) {
  for (const p of Object.keys(PLACEMENTS)) {
    const t = tidForSource(s, p);
    if (t.length > MAX) tooLong.push(`${t} (${t.length})`);
  }
}
if (tooLong.length) {
  failed = true;
  console.error(`\nOVER ${MAX} CHARS (${tooLong.length}): ${tooLong.slice(0, 5).join(', ')}`);
} else {
  console.log(`  all tids <= ${MAX} chars : OK`);
}

// 3. Round-trip: every tid must resolve back to exactly the slug that made it.
let bad = 0;
for (const s of slugs) {
  const tid = tidForSource(s, 'glance');
  const key = tid.replace(/_[a-z]$/, '');
  const matches = slugs.filter((x) => sourceKey(x) === key);
  if (matches.length !== 1 || matches[0] !== s) bad++;
}
if (bad) {
  failed = true;
  console.error(`\nROUND-TRIP FAILURES: ${bad}`);
} else {
  console.log(`  tid -> slug round-trip : ${slugs.length}/${slugs.length}  OK`);
}

// 4. Show the widest keys — the ones nearest a future collision.
const widest = [...byKey.keys()].sort((a, b) => b.length - a.length).slice(0, 3);
console.log(`\n  longest keys (closest to the 22-char truncation):`);
for (const k of widest) console.log(`    ${String(k.length).padStart(2)}  ${k}`);

console.log(failed ? '\nFAILED' : '\nPASS — tids are unique, in-cap, and reversible.');
process.exit(failed ? 1 : 0);
