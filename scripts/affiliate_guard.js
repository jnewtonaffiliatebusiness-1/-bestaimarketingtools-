#!/usr/bin/env node
/**
 * affiliate_guard.js — BLOCKS THE BUILD if any link in the affiliate registry
 * carries a tracking identifier that is NOT ours.
 *
 * WHY: this site's revenue depends entirely on lib/affiliates.ts. A single URL
 * with someone else's ref/via/aff parameter sends buying traffic — and the
 * commission — to a stranger, and it fails SILENTLY: the link works, the page
 * looks correct, the money goes elsewhere.
 *
 * RULE: a fallback must NEVER be an affiliate link. A wrong-affiliate default is
 * worse than $0 because it cannot be detected from the outside.
 *
 * Run:  node scripts/affiliate_guard.js      (wired to `npm run build`)
 * Exit 1 = build must not proceed.
 */

const fs = require('fs');
const path = require('path');

const REG = path.resolve(__dirname, '..', 'lib', 'affiliates.ts');

// Identifiers that belong to us. Anything tracked that is NOT one of these is a leak.
const OURS = [
  'jzoolu',                                          // ClickBank / GoHighLevel fp_ref
  'sa0275305417aeb2a342c03d32dcbb6d878ce2e94f',      // Systeme.io
];

// A URL carrying an affiliate/tracking identifier
const TRACKED = /[?&](sa|fp_ref|ref|aff|affiliate|via|partner|tap_a|irclickid|shareasale|impact|mbsy|rfsn)=/i;

const txt = fs.readFileSync(REG, 'utf8');

// Only real entries:  "slug": "url",   — ignores comments and the usage example
const entries = [...txt.matchAll(/^\s*"([^"]+)":\s*"([^"]+)"/gm)].map((m) => ({ slug: m[1], url: m[2] }));

if (entries.length === 0) {
  console.error('\n✗ AFFILIATE GUARD FAILED — parsed 0 entries from affiliates.ts. Refusing to pass.\n');
  process.exit(1);
}

const leaks = [];
let monetized = 0;

for (const e of entries) {
  if (!TRACKED.test(e.url)) continue;          // raw brand URL — earns nothing, but leaks nothing
  const lower = e.url.toLowerCase();
  const isOurs = OURS.some((id) => lower.includes(id.toLowerCase()));
  if (isOurs) monetized++;
  else leaks.push(e);
}

if (leaks.length) {
  console.error('\n✗ AFFILIATE GUARD FAILED — BUILD BLOCKED\n');
  console.error('  These links carry a tracking identifier that is NOT ours.');
  console.error('  Buying traffic sent through them pays SOMEONE ELSE:\n');
  leaks.forEach((l) => console.error(`    ${l.slug}\n      ${l.url}\n`));
  console.error('  FIX: replace with your own affiliate link, or revert to the plain brand URL.');
  console.error('  A raw brand URL earns nothing — but it does not pay a competitor.\n');
  process.exit(1);
}

console.log(
  `✓ affiliate guard: ${entries.length} entries, ${monetized} monetized to us, 0 foreign tracking links.`
);
process.exit(0);
