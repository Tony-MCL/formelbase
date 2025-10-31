import type { Formula } from "@/core/types"

export function FavoritesPanel({ items, onSelect }: { items: Formula[]; onSelect: (f: Formula) => void }) {
  return (
    <div className="panel p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Favoritter</div>
      {items.length === 0 ? (
        <div className="text-slate-500 text-sm">Ingen favoritter markert ennå.</div>
      ) : (
        <ul className="space-y-1">
          {items.map(f => (
            <li key={f.id}>
              <button className="text-sm hover:underline" onClick={() => onSelect(f)}>
                {f.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
