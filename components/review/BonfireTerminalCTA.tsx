import Link from "next/link";
import ComparisonTable from "./ComparisonTable";

interface ComparisonRow {
  feature: string;
  product: string;
  bonfire: string;
}

interface Props {
  productName: string;
  productWeaknesses: string[];
  comparisonRows: ComparisonRow[];
  testimonial?: string;
  utmCampaign: string;
}

export default function BonfireTerminalCTA({
  productName,
  productWeaknesses,
  comparisonRows,
  testimonial,
  utmCampaign,
}: Props) {
  const bonfireUrl = `https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=review&utm_campaign=${utmCampaign}`;

  return (
    <section className="mt-16 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-600/5 p-8">
      <div className="mb-2 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
        The Better Alternative
      </div>

      <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
        Bonfire Terminal
      </h2>

      <p className="mb-6 text-gray-300">
        We spent hours reviewing {productName} so you don&apos;t have to — and here&apos;s
        what we kept coming back to: while {productName} solves real problems, it comes
        with limitations that frustrate serious marketers. Bonfire Terminal was built
        specifically to address these gaps.
      </p>

      {productWeaknesses.length > 0 && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-3 font-semibold text-white">
            Why {productName} users switch to Bonfire Terminal:
          </h3>
          <ul className="space-y-2">
            {productWeaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-0.5 text-amber-400">→</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {comparisonRows.length > 0 && (
        <div className="mb-6">
          <ComparisonTable productName={productName} rows={comparisonRows} />
        </div>
      )}

      {testimonial && (
        <blockquote className="mb-6 border-l-4 border-amber-500 pl-4 italic text-gray-400">
          &ldquo;{testimonial}&rdquo;
        </blockquote>
      )}

      <Link
        href={bonfireUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-black transition hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
      >
        Try Bonfire Terminal Free
        <span>→</span>
      </Link>
    </section>
  );
}
