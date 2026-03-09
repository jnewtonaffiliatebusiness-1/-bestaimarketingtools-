interface Row {
  feature: string;
  product: string;
  bonfire: string;
}

interface Props {
  productName: string;
  rows: Row[];
}

export default function ComparisonTable({ productName, rows }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left text-gray-400">Feature</th>
            <th className="px-4 py-3 text-left text-gray-300">{productName}</th>
            <th className="px-4 py-3 text-left text-amber-400">Bonfire Terminal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/2" : ""}`}
            >
              <td className="px-4 py-3 text-gray-400">{row.feature}</td>
              <td className="px-4 py-3 text-gray-300">{row.product}</td>
              <td className="px-4 py-3 font-medium text-amber-300">{row.bonfire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
