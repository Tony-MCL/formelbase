/* ==== [BLOCK: Imports] BEGIN ==== */
import { Star, NotebookPen } from "lucide-react"
import type { Formula } from "@/core/types"
/* ==== [BLOCK: Imports] END ==== */

export function FormulaList({
  items,
  onSelect
}: {
  items: Formula[]
  onSelect: (f: Formula) => void
}) {
  return (
    <div className="panel p-2 divide-y divide-slate-200 dark:divide-slate-700">
      {items.map(f => (
        <button
          key={f.id}
          onClick={() => onSelect(f)}
          className="w-full text-left px-3 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-700/50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">{f.title}</div>
            <div className="flex items-center gap-2">
              {f.isFavorite ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : null}
              {f.userNote ? <NotebookPen className="w-4 h-4 opacity-70" /> : null}
            </div>
          </div>
          <div className="text-xs text-slate-500">{f.category} • {f.section}</div>
          <div className="text-xs mt-1 text-slate-600 dark:text-slate-300">{f.formula}</div>
        </button>
      ))}
      {items.length === 0 && (
        <div className="p-4 text-slate-500 text-sm">Ingen treff.</div>
      )}
    </div>
  )
}
