#!/usr/bin/env node
/**
 * vs_shingle_gate.js — the duplicate-content gate for the /vs/ section.
 *
 * WHY IT IS NOT scripts/shingle_overlap.js
 * That script reads the MDX source of reviews, so it measures prose an author
 * wrote and ignores everything a component renders. A /vs/ page has no MDX: all
 * of its text is composed at build time, and a large shared block (the sponsored
 * placement, the methodology note, the nav and footer) is real text that Google
 * sees on all 50. Measuring the source would score this section on the half of
 * itself that cannot repeat.
 *
 * So this measures the BUILT HTML — the artifact, not a proxy for it.
 *
 * WHY THE BENCHMARK IS ALSO MEASURED FROM BUILT HTML
 * Comparing rendered /vs/ pages against the 0.4% figure from the MDX script would
 * be comparing two different measurements and calling it a result. The benchmark
 * and control groups here are the SAME five review slugs that script uses, read
 * from their own built HTML, so all three numbers include the same site chrome
 * and are directly comparable.
 *
 * HOW TO READ IT
 * CONTROL is five of the original template-generated reviews — the pages whose
 * duplication got 100 reviews noindexed. That is the failure mode, rendered.
 * BENCHMARK is five hand-written reviews. NEW must sit near BENCHMARK.
 *
 *   npm run build && node scripts/vs_shingle_gate.js
 */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..', '.next', 'server', 'app');
const N = 8;

const BENCHMARK = ['mailchimp-review', 'convertkit-review', 'mailerlite-review', 'getresponse-review', 'aweber-review'];
const CONTROL = ['pipedrive-review', 'zoho-crm-review', 'hootsuite-review', 'moz-pro-review', 'sendible-review'];

function textOf(file) {
  const html = fs.readFileSync(file, 'utf8');
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(file) {
  const words = textOf(file);
  const set = new Set();
  for (let i = 0; i + N <= words.length; i++) set.add(words.slice(i, i + N).join(' '));
  return { set, words: words.length };
}

function measure(label, files) {
  const sets = files
    .filter((f) => fs.existsSync(f))
    .map((f) => ({ name: path.basename(f, '.html'), ...shingles(f) }));
  if (sets.length < 2) {
    console.log(`\n${label}: SKIPPED — only ${sets.length} page(s) found`);
    return null;
  }
  const pairs = [];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      let hits = 0;
      for (const s of sets[i].set) if (sets[j].set.has(s)) hits++;
      pairs.push({ a: sets[i].name, b: sets[j].name, v: hits / Math.min(sets[i].set.size, sets[j].set.size) });
    }
  }
  const mean = pairs.reduce((t, p) => t + p.v, 0) / pairs.length;
  const worst = pairs.reduce((m, p) => (p.v > m.v ? p : m), pairs[0]);
  const avgWords = Math.round(sets.reduce((t, s) => t + s.words, 0) / sets.length);
  console.log(`\n${label}  (${sets.length} pages, ${pairs.length} pairs, ~${avgWords} words each)`);
  console.log(`  mean pairwise overlap : ${(mean * 100).toFixed(1)}%`);
  console.log(`  worst pair            : ${(worst.v * 100).toFixed(1)}%  ${worst.a} <-> ${worst.b}`);

  // A mean can hide a bad tail. Two /vs/ pages that share a product also share
  // that product's whole panel, so the distribution matters more here than the
  // average does — report it rather than let one number stand in for 1,225.
  const sorted = pairs.map((p) => p.v).sort((x, y) => x - y);
  const q = (f) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * f))];
  console.log(
    `  distribution          : median ${(q(0.5) * 100).toFixed(1)}%  ` +
    `p90 ${(q(0.9) * 100).toFixed(1)}%  p99 ${(q(0.99) * 100).toFixed(1)}%`
  );
  return { mean, worst, pairs };
}

const vsFiles = fs.existsSync(path.join(APP, 'vs'))
  ? fs.readdirSync(path.join(APP, 'vs')).filter((f) => f.endsWith('.html')).map((f) => path.join(APP, 'vs', f))
  : [];

if (!vsFiles.length) {
  console.error('No built /vs/ pages found. Run `npm run build` first.');
  process.exit(1);
}

const rev = (s) => path.join(APP, 'reviews', s + '.html');

console.log(`Measuring built HTML in ${APP}`);
const neu = measure('NEW (/vs/ tranche 1)', vsFiles);
const bench = measure('BENCHMARK (hand-written reviews, rendered)', BENCHMARK.map(rev));
const ctrl = measure('CONTROL (template-generated reviews, rendered)', CONTROL.map(rev));

console.log('\n─────────────────────────────────────────────────────────────');
if (!bench || !ctrl) {
  console.error('Cannot judge without both a benchmark and a control. Failing closed.');
  process.exit(1);
}

// The gate: NEW must be closer to BENCHMARK than to CONTROL, and must not exceed
// the benchmark by more than half again. A fixed threshold would be arbitrary;
// the control is what makes the number mean something.
const midpoint = (bench.mean + ctrl.mean) / 2;
const ceiling = bench.mean * 1.5;
const passes = neu.mean < midpoint && neu.mean <= ceiling;

// Which /vs/ pairs are as duplicated as the templated control's AVERAGE page?
// These are always pairs that share a product, so they share its whole panel.
const hot = neu.pairs.filter((p) => p.v >= ctrl.mean).sort((x, y) => y.v - x.v);
console.log(
  `\n${hot.length} of ${neu.pairs.length} /vs/ page-pairs (${((hot.length / neu.pairs.length) * 100).toFixed(1)}%) ` +
  `overlap at or above the CONTROL mean of ${(ctrl.mean * 100).toFixed(1)}%:`
);
for (const p of hot.slice(0, 8)) console.log(`   ${(p.v * 100).toFixed(1)}%  ${p.a} <-> ${p.b}`);
if (hot.length > 8) console.log(`   … and ${hot.length - 8} more`);

console.log(`\nNEW ${(neu.mean * 100).toFixed(1)}%  |  BENCHMARK ${(bench.mean * 100).toFixed(1)}%  |  CONTROL ${(ctrl.mean * 100).toFixed(1)}%`);
console.log(`Gate: NEW must be < midpoint ${(midpoint * 100).toFixed(1)}% and <= 1.5x benchmark ${(ceiling * 100).toFixed(1)}%`);
console.log(passes ? '\n✅ PASS — the tranche reads closer to hand-written than to templated.' : '\n❌ FAIL — too close to the templated control. Do not publish.');
process.exit(passes ? 0 : 1);
