/**
 * Fetch vendor logos into public/images/logos/<slug>.png
 *
 *   LOGODEV_KEY=pk_xxx node scripts/fetch_logos.mjs --limit 3   # try a few
 *   LOGODEV_KEY=pk_xxx node scripts/fetch_logos.mjs             # all of them
 *   node scripts/fetch_logos.mjs --report                       # what's on disk now
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY: 106 review pages carried `logoImage:` frontmatter pointing at
 * /images/logos/<slug>.svg — and that directory was EMPTY. Nothing rendered them
 * (the only consumer used the field's existence to pick an emoji), so nothing was
 * visibly broken, but the field was a lie. This fetches the real thing so the
 * cards can show it.
 *
 * SLUG -> DOMAIN comes from lib/affiliates.ts, which holds the authoritative
 * vendor URL per review. Five hand-written buyer-intent pages are not tools and
 * have no entry there, so they are mapped explicitly below.
 *
 * 🔑 VERIFY, DON'T ASSUME. logo.dev returns HTTP 200 with a *generated monogram*
 * when it has no real logo for a domain. A 200 is not evidence. This script
 * records every file's size and flags near-duplicates so a wall of identical
 * generated initials cannot pass as success.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');
const OUT = path.join(ROOT, 'public', 'images', 'logos');
const KEY = process.env.LOGODEV_KEY;

// Pages that are comparisons/guides, not a single tool. Not in affiliates.ts.
const MANUAL = {
  'gohighlevel-alternatives-flat-pricing': 'https://gohighlevel.com',
  'gohighlevel-real-agency-cost':          'https://gohighlevel.com',
  'leaving-gohighlevel-switching-costs':   'https://gohighlevel.com',
  'systeme-io-free-plan-limits':           'https://systeme.io',
  'systeme-io-vs-clickfunnels':            'https://systeme.io',
};

function slugsNeedingLogos() {
  const dir = path.join(ROOT, 'content', 'reviews');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    .filter((f) => /^logoImage:/m.test(fs.readFileSync(path.join(dir, f), 'utf8')))
    .map((f) => f.replace('.mdx', ''));
}

function slugToDomain() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'affiliates.ts'), 'utf8');
  const map = { ...MANUAL };
  for (const m of src.matchAll(/"([a-z0-9-]+)":\s*"(https?:\/\/[^"]+)"/g)) {
    if (!map[m[1]]) map[m[1]] = m[2];
  }
  return map;
}

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;

if (args.includes('--report')) {
  const files = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((f) => f.endsWith('.png')) : [];
  const bySize = new Map();
  for (const f of files) {
    const h = crypto.createHash('md5').update(fs.readFileSync(path.join(OUT, f))).digest('hex');
    if (!bySize.has(h)) bySize.set(h, []);
    bySize.get(h).push(f);
  }
  const dupes = [...bySize.values()].filter((g) => g.length > 1);
  console.log(`on disk: ${files.length} logos`);
  console.log(`distinct images: ${bySize.size}`);
  if (dupes.length) {
    console.log(`\n⚠️  ${dupes.length} sets of IDENTICAL images — likely generated fallbacks, not real logos:`);
    dupes.slice(0, 5).forEach((g) => console.log(`   ${g.length}x  ${g.slice(0, 4).join(', ')}${g.length > 4 ? ' …' : ''}`));
  }
  process.exit(0);
}

if (!KEY) {
  console.error('\n✖ Set LOGODEV_KEY first (free key at logo.dev).');
  console.error('  PowerShell:  $env:LOGODEV_KEY=\'pk_…\'; node scripts/fetch_logos.mjs\n');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const map = slugToDomain();
const slugs = slugsNeedingLogos().filter((s) => map[s]).slice(0, limit);
const noDomain = slugsNeedingLogos().filter((s) => !map[s]);

console.log(`fetching ${slugs.length} logos -> ${OUT}\n`);
let ok = 0, failed = [];

for (const slug of slugs) {
  const host = new URL(map[slug]).hostname.replace(/^www\./, '');
  const url = `https://img.logo.dev/${host}?token=${encodeURIComponent(KEY)}&size=200&format=png`;
  try {
    const r = await fetch(url);
    const ct = r.headers.get('content-type') || '';
    const buf = Buffer.from(await r.arrayBuffer());
    // A 200 is not enough — require image bytes of a plausible size.
    if (!r.ok || !ct.startsWith('image/') || buf.length < 500) {
      failed.push(`${slug} (${host}) — HTTP ${r.status} ${ct} ${buf.length}b`);
      continue;
    }
    fs.writeFileSync(path.join(OUT, `${slug}.png`), buf);
    console.log(`  ${String(buf.length).padStart(7)}b  ${host.padEnd(28)} -> ${slug}.png`);
    ok++;
  } catch (e) {
    failed.push(`${slug} (${host}) — ${e.message}`);
  }
}

console.log(`\n✓ ${ok} written`);
if (noDomain.length) console.log(`⚠️  ${noDomain.length} slugs have no vendor URL: ${noDomain.join(', ')}`);
if (failed.length) {
  console.log(`\n🚨 ${failed.length} FAILED:`);
  failed.forEach((f) => console.log('   ' + f));
}
console.log('\nNow run:  node scripts/fetch_logos.mjs --report   (checks for identical fallback images)');
