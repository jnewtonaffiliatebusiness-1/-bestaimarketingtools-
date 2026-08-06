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
// CHECK 2 (added 2026-08-06): Digistore24 PATH-based affiliate links.
//
// The check above only inspects query parameters (?ref=, ?via=, …). The AI
// Marketers Club link puts the affiliate ID in the PATH instead:
//
//     https://www.digistore24.com/redir/300124/JNewton/aitoolshub
//                                       ^prod   ^payee  ^campaign
//
// So a link paying a stranger — .../redir/300124/SomeoneElse/… — passed the
// original guard silently. This is the single highest-value link on the site.
// Scans every source file, not just the registry, so a stray copy-paste
// anywhere is caught too.
const SRC_DIRS = ['app', 'components', 'lib', 'scripts'];
const DIGISTORE_REDIR = /digistore24\.com\/redir\/([^/\s"'`]+)\/([^/\s"'`?]+)/gi;
const OUR_DIGISTORE_AFFILIATE = 'JNewton';
const OUR_DIGISTORE_PRODUCT = '300124';

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

function scanDigistore(files) {
  const bad = [];
  let found = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(DIGISTORE_REDIR)) {
      const [full, product, affiliate] = m;
      // The template literal in lib/offer.ts builds the path from constants —
      // it reads as "${CLUB_PRODUCT_ID}/${CLUB_AFFILIATE_ID}". Skip the
      // interpolated form here; the constants themselves are checked below.
      if (product.startsWith('${') || affiliate.startsWith('${')) continue;
      if (product.startsWith('{') || affiliate.startsWith('{')) continue; // doc comment
      found++;
      if (affiliate !== OUR_DIGISTORE_AFFILIATE || product !== OUR_DIGISTORE_PRODUCT) {
        bad.push({ file: path.relative(path.resolve(__dirname, '..'), file), url: full });
      }
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
const declaredProduct = constOf('CLUB_PRODUCT_ID');

if (declaredAffiliate !== OUR_DIGISTORE_AFFILIATE || declaredProduct !== OUR_DIGISTORE_PRODUCT) {
  console.error('\n✗ AFFILIATE GUARD FAILED — BUILD BLOCKED\n');
  console.error('  lib/offer.ts does not pay us. Every club CTA on the site is built from these:');
  console.error(`    CLUB_PRODUCT_ID   = ${declaredProduct   ?? '(unparseable)'}   expected ${OUR_DIGISTORE_PRODUCT}`);
  console.error(`    CLUB_AFFILIATE_ID = ${declaredAffiliate ?? '(unparseable)'}   expected ${OUR_DIGISTORE_AFFILIATE}\n`);
  process.exit(1);
}

const { bad: digistoreLeaks, found: digistoreFound } = scanDigistore(walk('app').concat(
  walk('components'), walk('lib'), walk('scripts')
));

if (digistoreLeaks.length) {
  console.error('\n✗ AFFILIATE GUARD FAILED — BUILD BLOCKED\n');
  console.error('  Hardcoded Digistore24 links that do NOT pay us:\n');
  digistoreLeaks.forEach((l) => console.error(`    ${l.file}\n      ${l.url}\n`));
  console.error(`  FIX: delete the hardcoded URL and call clubUrl() from lib/offer.ts instead.\n`);
  process.exit(1);
}

console.log(
  `✓ affiliate guard: ${entries.length} entries, ${monetized} monetized to us, 0 foreign tracking links.`
);
console.log(
  `✓ digistore path check: affiliate "${declaredAffiliate}" / product ${declaredProduct} in lib/offer.ts, ${digistoreFound} hardcoded literal(s) scanned, 0 foreign.`
);
process.exit(0);
