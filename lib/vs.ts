/**
 * lib/vs.ts — the data layer behind the /vs/ programmatic comparison section.
 *
 * WHY THIS SECTION EXISTS
 * Tranche 1 of the programmatic SEO programme (see
 * E:\AFFILIATE MARKETING MASTER\PROGRAMMATIC_SEO\PSEO_PROMPT_PACK_2026-08-14.md).
 * It is deliberately 50 pages, not 1,000: GSC on 2026-08-11 showed 20 of this
 * domain's 24 unindexed pages sitting in "Discovered, currently not indexed",
 * meaning Google found them and declined. Shipping 1,000 pages into that verdict
 * would learn the same lesson 20× more expensively. Ship 50, measure the indexed
 * ratio of THIS tranche, then decide.
 *
 * WHY IT IS BUILT FROM OUR OWN REVIEWS AND NOTHING ELSE
 * Every number on a /vs/ page comes from a review whose price was re-verified
 * against the vendor's own pricing page. Nothing here is generated prose about a
 * product: the verdicts, pros and cons are the hand-written ones, and the only
 * text this module composes is the arithmetic BETWEEN two of them.
 *
 * THE TRAP THIS MODULE IS BUILT AROUND
 * `pricingStart: 0` means two opposite things in this corpus — a real free tier
 * (Buffer, HubSpot) and no published fixed price at all (Woodpecker sells per
 * 100 prospects contacted). So a zero is never rendered as "free" and never wins
 * a price comparison. `priceComparable()` in lib/pricing.ts is the single gate;
 * when it says no, this module explains WHY rather than quietly omitting the row.
 */
import { getAllReviews, type Review, type ReviewFrontmatter } from "@/lib/reviews";
import { formatStartingPrice, priceComparable } from "@/lib/pricing";

export interface Product {
  name: string;
  slug: string;
  review: Review;
  category: string;
}

export interface Pair {
  slugs: string;
  a: Product;
  b: Product;
  category: string;
}

/** URL-safe slug from a product name. "Systeme.io" -> "systeme-io". */
export function productSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productNameOf(fm: ReviewFrontmatter): string {
  return fm.productName ?? fm.title.split(" Review")[0].split(":")[0].trim();
}

/**
 * One canonical review per product, indexable only.
 *
 * Four separate reviews carry productName "GoHighLevel" and three carry
 * "Systeme.io" — the editorial deep-dives (real-agency-cost, switching-costs,
 * vs-clickfunnels …). Without this collapse the section would generate
 * "GoHighLevel vs GoHighLevel". The plain "<product>-review" slug wins where it
 * exists; otherwise the highest-rated one does.
 *
 * Noindexed reviews are excluded outright. Pairing a page we have told Google to
 * ignore into a page we are asking it to rank spends the new page's credibility
 * on the exact content that suppressed the domain in the first place.
 */
export function getProducts(): Product[] {
  const byName = new Map<string, Review[]>();
  for (const r of getAllReviews()) {
    if (r.frontmatter.noindex) continue;
    const name = productNameOf(r.frontmatter);
    const list = byName.get(name) ?? [];
    list.push(r);
    byName.set(name, list);
  }

  const products: Product[] = [];
  for (const [name, list] of byName) {
    const canonical =
      list.find((r) => r.frontmatter.slug === `${productSlug(name)}-review`) ??
      list.find((r) => /-review$/.test(r.frontmatter.slug)) ??
      list.slice().sort((x, y) => y.frontmatter.rating - x.frontmatter.rating)[0];
    products.push({
      name,
      slug: productSlug(name),
      review: canonical,
      category: canonical.frontmatter.category,
    });
  }
  return products.sort((a, b) => a.slug.localeCompare(b.slug));
}

const TRANCHE_SIZE = 50;

/** Offers we are actually paid on. Pages about these can earn; the rest inform. */
const TRACKED = new Set(["gohighlevel", "systeme-io"]);

/**
 * The 50 pairs in tranche 1, chosen by a rule rather than by taste.
 *
 * ⚠️ This is NOT ranked by search demand — we have no keyword volume data for
 * this domain yet, and pretending otherwise would put a fake number behind a
 * real decision. The rule is:
 *   1. every pair involving a tracked offer (these are the pages that can earn),
 *   2. then every pair in the three small categories, which exhausts them,
 *   3. then the highest-rated remaining pairs until we reach 50.
 * Deterministic, so the same 50 come out on every build.
 *
 * Pairs are always within one category. "Ahrefs vs Mailchimp" is a query nobody
 * types, and generating it would be volume for its own sake.
 */
export function getPairs(): Pair[] {
  const products = getProducts();
  const byCat = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCat.get(p.category) ?? [];
    list.push(p);
    byCat.set(p.category, list);
  }

  const all: Pair[] = [];
  for (const [category, list] of byCat) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        // Alphabetical ordering gives each pair exactly one URL, so
        // "close vs copper" and "copper vs close" can never both exist.
        const [a, b] = [list[i], list[j]].sort((x, y) => x.slug.localeCompare(y.slug));
        all.push({ slugs: `${a.slug}-vs-${b.slug}`, a, b, category });
      }
    }
  }

  const smallCats = new Set(
    [...byCat.entries()].filter(([, list]) => list.length <= 6).map(([c]) => c)
  );
  const rating = (p: Pair) => p.a.review.frontmatter.rating + p.b.review.frontmatter.rating;

  const tier = (p: Pair) =>
    TRACKED.has(p.a.slug) || TRACKED.has(p.b.slug) ? 0 : smallCats.has(p.category) ? 1 : 2;

  return all
    .sort((x, y) => tier(x) - tier(y) || rating(y) - rating(x) || x.slugs.localeCompare(y.slugs))
    .slice(0, TRANCHE_SIZE);
}

export function getPairBySlugs(slugs: string): Pair | null {
  return getPairs().find((p) => p.slugs === slugs) ?? null;
}

/**
 * Other comparisons to link to — the internal link graph.
 *
 * The first version returned `.slice(0, limit)` of the category, which handed
 * every page in a category THE SAME six links. That was bad twice over: the link
 * block was identical text on a dozen pages (the duplicate-content gate saw it),
 * and six pages hoarded all the inbound links while the rest of the category got
 * none — on a domain whose main problem is already "Discovered, currently not
 * indexed", orphaning your own pages is the last thing you want.
 *
 * Now: the genuinely related ones first (they share a product with this pair, so
 * a reader comparing X to Y plausibly wants X against something else), then a
 * rotating window over the rest so every page in the category gets linked from
 * somewhere and no two pages carry the same block.
 */
export function getRelatedPairs(slugs: string, category: string, limit = 6): Pair[] {
  const pair = getPairBySlugs(slugs);
  const siblings = getPairs().filter((p) => p.slugs !== slugs && p.category === category);
  if (!pair) return siblings.slice(0, limit);

  const sharesProduct = (p: Pair) =>
    p.a.slug === pair.a.slug || p.a.slug === pair.b.slug ||
    p.b.slug === pair.a.slug || p.b.slug === pair.b.slug;

  const related = siblings.filter(sharesProduct);
  const rest = siblings.filter((p) => !sharesProduct(p));

  // Deterministic rotation: start the fill at this pair's own position in the
  // category, so consecutive pages draw from different parts of the list.
  const offset = siblings.findIndex((p) => p.slugs > slugs);
  const start = offset < 0 ? 0 : offset;
  const rotated = rest.length ? [...rest.slice(start % rest.length), ...rest.slice(0, start % rest.length)] : [];

  return [...related.slice(0, Math.min(3, limit)), ...rotated].slice(0, limit);
}

/**
 * The comparison pages that feature a given product, for linking FROM that
 * product's own review and category pages.
 *
 * THE BUG THIS FIXES — measured, not guessed.
 * On 2026-08-17, three days after tranche 1 shipped and after the sitemap had
 * been resubmitted and read, `gsc.js coverage /vs/` returned the same verdict
 * for all fifty pages:
 *
 *     50  URL is unknown to Google      INDEXED: 0/50 (0%)
 *
 * "Unknown to Google" is NOT "Discovered, currently not indexed". Discovered
 * means Google looked and declined — the authority verdict this programme was
 * built to test. Unknown means Google never saw the page at all, so nothing has
 * been judged and the tranche has produced no reading on authority whatsoever.
 *
 * The cause was structural and site-wide: `grep -rn 'href="/vs'` over app/ and
 * components/ matched exactly one file — /vs/[slugs] linking to its own
 * siblings. The index linked out to all 50 and each page linked to six more,
 * but the entire component hung off a page with ZERO inbound links. A crawler
 * entering from the homepage, a review, or a category page had no path to it,
 * and the sitemap by itself did not carry it.
 *
 * ⛔ The lesson worth keeping: an internally well-linked island is still an
 * island. Link density INSIDE a new section proves nothing; what matters is at
 * least one edge from the part of the site Google already crawls.
 *
 * Review pages are the right source for that edge — they are the pages this
 * domain already gets crawled on, and "GoHighLevel vs HubSpot CRM" from the
 * GoHighLevel review is a topically adjacent link rather than a nav dump.
 */
export function getPairsForProduct(
  slug: string,
  limit = 8
): { pair: Pair; other: Product }[] {
  return getPairs()
    .filter((p) => p.a.slug === slug || p.b.slug === slug)
    .map((p) => ({ pair: p, other: p.a.slug === slug ? p.b : p.a }))
    .slice(0, limit);
}

/** The comparison pages within one category, for linking from the category page. */
export function getPairsForCategory(category: string, limit = 12): Pair[] {
  return getPairs().filter((p) => p.category === category).slice(0, limit);
}

export interface Difference {
  label: string;
  text: string;
}

/**
 * The only prose this module composes: what is true of the PAIR.
 *
 * Each branch states a fact or states why the fact cannot be stated. There is no
 * branch that produces a comparison we cannot support — the whole point of the
 * `priceComparable` refusal path is that "we can't rank these two prices, and
 * here is why" is a more useful sentence than a confident wrong one.
 */
export function getDifferences(a: Product, b: Product): Difference[] {
  const fa = a.review.frontmatter;
  const fb = b.review.frontmatter;
  const out: Difference[] = [];

  const priceA = formatStartingPrice(fa);
  const priceB = formatStartingPrice(fb);

  if (priceComparable(fa, fb)) {
    const cheap = fa.pricingStart <= fb.pricingStart ? a : b;
    const dear = cheap === a ? b : a;
    const lo = Math.min(fa.pricingStart, fb.pricingStart);
    const hi = Math.max(fa.pricingStart, fb.pricingStart);
    const delta = hi - lo;
    const unit = fa.pricingUnit ?? "month";
    const cur = fa.pricingCurrency ?? "$";
    const times = lo > 0 ? hi / lo : 0;
    out.push({
      label: "Entry price",
      text:
        `${a.name} starts at ${priceA}; ${b.name} starts at ${priceB}. ` +
        `${cheap.name} is ${cur}${delta % 1 === 0 ? delta : delta.toFixed(2)} a ${unit} cheaper to start` +
        (times >= 2 ? `, and ${dear.name} is ${times.toFixed(1)}× the entry price` : "") +
        `. Entry price is not total cost — check the limit that binds first on each.`,
    });
  } else if (!fa.pricingStart || !fb.pricingStart) {
    // The first draft of this read "<X> publishes a single starting price we can
    // rank against the other, so we do not rank them" — the negation was missing,
    // so it asserted the exact opposite of the case it was handling, on 10 pages.
    const bothMissing = !fa.pricingStart && !fb.pricingStart;
    const missing = bothMissing ? null : !fa.pricingStart ? a : b;
    const other = missing ? (missing.slug === a.slug ? b : a) : null;
    const caveat =
      `A zero in our data means one of two opposite things — a genuine free tier, or a product that is ` +
      `not sold at a fixed monthly rate at all — so calling either one "cheapest" would be wrong.`;
    out.push({
      label: "Entry price",
      text: bothMissing
        ? `Neither ${a.name} nor ${b.name} publishes a single starting price we can rank, so we do not rank ` +
          `them. ${caveat}`
        : `${missing!.name} does not publish a single starting price we can rank against ` +
          `${other!.name}'s ${formatStartingPrice(other!.review.frontmatter)}, so we do not rank them. ${caveat}`,
    });
  } else if ((fa.pricingCurrency ?? "$") !== (fb.pricingCurrency ?? "$")) {
    out.push({
      label: "Entry price",
      text:
        `${a.name} is priced in ${fa.pricingCurrency ?? "$"} and ${b.name} in ${fb.pricingCurrency ?? "$"} ` +
        `(${priceA} against ${priceB}). We do not convert between them, because the rate on the day you read ` +
        `this is not the rate we would be quoting.`,
    });
  } else {
    out.push({
      label: "Billing period",
      text:
        `These are quoted on different periods — ${priceA} against ${priceB} — so the two numbers are not ` +
        `comparable as printed. Put both on the same period before you weigh them.`,
    });
  }

  const gap = Math.abs(fa.rating - fb.rating);
  if (gap >= 0.5) {
    const better = fa.rating > fb.rating ? a : b;
    out.push({
      label: "Our rating",
      text: `We rate ${better.name} higher — ${fa.rating}/5 against ${fb.rating}/5.`,
    });
  } else {
    out.push({
      label: "Our rating",
      text:
        `${fa.rating}/5 against ${fb.rating}/5. That gap is inside our own margin, so treat these as rated ` +
        `level and decide on the specifics below rather than on the score.`,
    });
  }

  // Does the money track the rating? Only answerable when the prices are
  // rankable at all — otherwise this would be the price comparison the branch
  // above just refused to make, smuggled back in through a different sentence.
  if (priceComparable(fa, fb) && gap >= 0.5) {
    const cheaper = fa.pricingStart <= fb.pricingStart ? a : b;
    const better = fa.rating > fb.rating ? a : b;
    const unit = fa.pricingUnit ?? "month";
    const cur = fa.pricingCurrency ?? "$";
    const yearly = Math.abs(fa.pricingStart - fb.pricingStart) * (unit === "month" ? 12 : 1);
    out.push({
      label: "Price against rating",
      text:
        cheaper.slug === better.slug
          ? `${cheaper.name} is both the cheaper of the two and the higher rated, which is unusual in this ` +
            `category and makes it the easier default here.`
          : `The cheaper option is not the better rated one. ${better.name} costs about ${cur}` +
            `${yearly % 1 === 0 ? yearly : yearly.toFixed(2)} more a year than ${cheaper.name} at entry — ` +
            `that is the size of the premium you would be paying for the higher score.`,
    });
  }

  // Where each sits in the price order of everything we have reviewed in the
  // category. Puts the pair in context rather than in a vacuum, and the ranking
  // moves as the category grows rather than being a number typed in once.
  const peers = getProducts()
    .filter((p) => p.category === a.category && p.review.frontmatter.pricingStart > 0)
    .sort((x, y) => x.review.frontmatter.pricingStart - y.review.frontmatter.pricingStart);
  const rankOf = (p: Product) => peers.findIndex((q) => q.slug === p.slug) + 1;
  const ra = rankOf(a);
  const rb = rankOf(b);
  if (ra > 0 && rb > 0 && peers.length >= 4) {
    const ord = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
    };
    // "seo-content-tools" -> "seo content", so the sentence below does not read
    // "6 seo content tools tools".
    const label = a.category.replace(/-/g, " ").replace(/\s*tools$/, "");
    out.push({
      label: "Against the rest of the category",
      text:
        `Of the ${peers.length} ${label} tools we have reviewed that publish a starting price, ` +
        `${a.name} is the ${ord(ra)} cheapest to start and ${b.name} the ${ord(rb)}.`,
    });
  }

  return out;
}
