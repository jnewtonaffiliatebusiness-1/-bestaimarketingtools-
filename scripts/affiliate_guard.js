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

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2 — the club offer link.
//
// 🚨 REWRITTEN 2026-08-07 WHEN THE OFFER MOVED DIGISTORE24 → CLICKBANK.
// The previous version validated the Digistore path shape
// (digistore24.com/redir/{product}/{payee}/…). After the switch there are zero
// Digistore links left, so that check would have found nothing, reported
// "0 foreign" and PASSED — protecting the site's highest-value link with a test
// that no longer looked at it. A check that stops covering what it was written
// to cover does not fail; it goes quiet. This one had to move with the URL.
//
// ClickBank puts the payee in a QUERY PARAM:
//     https://hop.clickbank.net/?affiliate=jzoolu&vendor=j1r2c
// Scans every source file, not just the registry, so a stray copy-paste is caught.
// NOTE the capture includes the leading "?" — without it, an `affiliate=` sitting
// at position 0 never matches the `[?&]affiliate=` lookup below and every link
// reports affiliate="(none)". Found by the clean-run control, 2026-08-07.
const CB_HOPLINK = /hop\.clickbank\.net\/?(\?[^"'`\s]+)/gi;
const OUR_CB_AFFILIATE = 'jzoolu';
const OUR_CB_VENDOR = 'j1r2c';
// Any leftover Digistore club link is now a LEAK by definition — it pays the
// front end only and bypasses the funnel commission entirely.
const STALE_DIGISTORE = /digistore24\.com\/redir\/[^"'`\s]+/gi;

function walk(dir, acc = []) {
  const root = path.resolve(__dirname, '..', dir);
  if (!fs.existsSync(root)) return acc;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(path.relative(path.resolve(__dirname, '..'), full), acc);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function scanClickbank(files) {
  const bad = [];
  let found = 0;
  for (const file of files) {
    // Skip this file. It necessarily contains example URLs in its own comments,
    // and scanning them produced false positives on the first clean run.
    if (path.resolve(file) === path.resolve(__filename)) continue;

    const src = fs.readFileSync(file, 'utf8');

    // Any hardcoded hoplink must name US.
    for (const m of src.matchAll(CB_HOPLINK)) {
      const qs = m[1];
      if (qs.includes('${')) continue;                  // built from constants — checked below
      if (/\{[A-Za-z_]+\}/.test(qs)) continue;          // {NICKNAME}/{VENDOR} placeholder in docs
      found++;
      const aff = (qs.match(/[?&]affiliate=([^&"'`\s]+)/i) || [])[1];
      const ven = (qs.match(/[?&]vendor=([^&"'`\s]+)/i) || [])[1];
      if (aff !== OUR_CB_AFFILIATE || ven !== OUR_CB_VENDOR) {
        bad.push({
          file: path.relative(path.resolve(__dirname, '..'), file),
          url: m[0],
          why: `affiliate="${aff ?? '(none)'}" vendor="${ven ?? '(none)'}"`,
        });
      }
    }

    // A surviving Digistore club link is a leak now: it pays the front end only.
    for (const m of src.matchAll(STALE_DIGISTORE)) {
      if (m[0].includes('${') || /\{[A-Za-z_]+\}/.test(m[0])) continue;  // doc placeholder
      bad.push({
        file: path.relative(path.resolve(__dirname, '..'), file),
        url: m[0],
        why: 'STALE Digistore24 link — pays the front end only, bypasses the funnel commission',
      });
    }
  }
  return { bad, found };
}

// The constants that actually build the live URL.
const OFFER = path.resolve(__dirname, '..', 'lib', 'offer.ts');
if (!fs.existsSync(OFFER)) {
  console.error('\n✗ AFFILIATE GUARD FAILED — lib/offer.ts is missing. It holds the only copy of the club affiliate link.\n');
  process.exit(1);
}
const offerSrc = fs.readFileSync(OFFER, 'utf8');
const constOf = (name) => (offerSrc.match(new RegExp(`export const ${name}\\s*=\\s*"([^"]+)"`)) || [])[1];
const declaredAffiliate = constOf('CLUB_AFFILIATE_ID');
const declaredVendor = constOf('CLUB_VENDOR_ID');

if (declaredAffiliate !== OUR_CB_AFFILIATE || declaredVendor !== OUR_CB_VENDOR) {
  console.error('\n✗ AFFILIATE GUARD FAILED — BUILD BLOCKED\n');
  console.error('  lib/offer.ts does not pay us. Every club CTA on the site is built from these:');
  console.error(`    CLUB_AFFILIATE_ID = ${declaredAffiliate ?? '(unparseable)'}   expected ${OUR_CB_AFFILIATE}`);
  console.error(`    CLUB_VENDOR_ID    = ${declaredVendor    ?? '(unparseable)'}   expected ${OUR_CB_VENDOR}\n`);
  process.exit(1);
}

// The site must not still be building a Digistore URL anywhere.
if (/digistore24\.com\/redir\/\$\{/.test(offerSrc)) {
  console.error('\n✗ AFFILIATE GUARD FAILED — lib/offer.ts still builds a Digistore24 redirect.\n');
  process.exit(1);
}

const { bad: clubLeaks, found: cbFound } = scanClickbank(walk('app').concat(
  walk('components'), walk('lib'), walk('scripts')
));

if (clubLeaks.length) {
  console.error('\n✗ AFFILIATE GUARD FAILED — BUILD BLOCKED\n');
  console.error('  Club links that do NOT pay us correctly:\n');
  clubLeaks.forEach((l) => console.error(`    ${l.file}\n      ${l.url}\n      ${l.why}\n`));
  console.error(`  FIX: delete the hardcoded URL and call clubUrl() from lib/offer.ts instead.\n`);
  process.exit(1);
}

console.log(
  `✓ affiliate guard: ${entries.length} entries, ${monetized} monetized to us, 0 foreign tracking links.`
);
console.log(
  `✓ clickbank check: affiliate "${declaredAffiliate}" / vendor "${declaredVendor}" in lib/offer.ts, ` +
  `${cbFound} hardcoded hoplink(s) scanned, 0 foreign, 0 stale Digistore links.`
);
process.exit(0);
