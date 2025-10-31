import type { Formula } from "@/core/types"

export function VariableTable({ f }: { f: Formula }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-500">
          <th className="py-1">Symbol</th>
          <th className="py-1">Navn</th>
          <th className="py-1">Enhet</th>
          <th className="py-1">Forklaring</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(f.variables).map(v => (
          <tr key={v.symbol} className="border-t border-slate-200 dark:border-slate-700">
            <td className="py-1 font-semibold">{v.symbol}</td>
            <td className="py-1">{v.name}</td>
            <td className="py-1">{v.unit}</td>
            <td className="py-1 text-slate-600 dark:text-slate-300">{v.description ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
