interface Props {
  pros: string[];
  cons: string[];
}

export default function ProsConsList({ pros, cons }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <h3 className="mb-3 font-semibold text-emerald-400">Pros</h3>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="mt-0.5 text-emerald-400">✓</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="mb-3 font-semibold text-red-400">Cons</h3>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="mt-0.5 text-red-400">✗</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
