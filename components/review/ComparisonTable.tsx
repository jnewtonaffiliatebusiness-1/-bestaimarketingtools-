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
    <div className="overflow-hidden rounded-xl border border-[#e6e2da]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e6e2da] bg-white">
            <th className="px-4 py-3 text-left text-[#55514a]">Feature</th>
            <th className="px-4 py-3 text-left text-[#55514a]">{productName}</th>
            <th className="px-4 py-3 text-left text-[#b8460f]">Bonfire Terminal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-[#e6e2da] ${i % 2 === 0 ? "bg-[#f2f0ea]" : ""}`}
            >
              <td className="px-4 py-3 text-[#55514a]">{row.feature}</td>
              <td className="px-4 py-3 text-[#55514a]">{row.product}</td>
              <td className="px-4 py-3 font-medium text-[#b8460f]">{row.bonfire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
