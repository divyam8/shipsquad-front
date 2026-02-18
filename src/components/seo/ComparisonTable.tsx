interface ComparisonFeature {
  feature: string;
  toolA: string;
  toolB: string;
  winner?: "a" | "b" | "tie";
}

interface ComparisonTableProps {
  toolAName: string;
  toolBName: string;
  features: ComparisonFeature[];
}

export function ComparisonTable({
  toolAName,
  toolBName,
  features,
}: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            <th className="px-4 py-3 text-sm font-medium text-text-secondary">
              Feature
            </th>
            <th className="px-4 py-3 text-sm font-medium text-accent-blue">
              {toolAName}
            </th>
            <th className="px-4 py-3 text-sm font-medium text-accent-purple">
              {toolBName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.03] last:border-0"
            >
              <td className="px-4 py-3 text-sm text-text-primary font-medium">
                {f.feature}
              </td>
              <td
                className={`px-4 py-3 text-sm ${
                  f.winner === "a"
                    ? "text-green-400 font-medium"
                    : "text-text-secondary"
                }`}
              >
                {f.toolA}
              </td>
              <td
                className={`px-4 py-3 text-sm ${
                  f.winner === "b"
                    ? "text-green-400 font-medium"
                    : "text-text-secondary"
                }`}
              >
                {f.toolB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
