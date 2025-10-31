/* ==== [BLOCK: NavTree] BEGIN ==== */
import React, { useMemo } from "react"
import type { Formula } from "@/core/types"

export function NavTree({
  items,
  onSelect
}: {
  items: Formula[]
  onSelect: (f: Formula) => void
}) {
  // Gruppér: Kategori -> Seksjon -> Formler
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, Formula[]>>()
    for (const f of items) {
      const cat = f.category || "Uten kategori"
      const sec = f.section || "Uten seksjon"
      if (!map.has(cat)) map.set(cat, new Map())
      const secMap = map.get(cat)!
      if (!secMap.has(sec)) secMap.set(sec, [])
      secMap.get(sec)!.push(f)
    }
    // Sortér alfabetisk for stabil visning
    const sorted: Array<[string, Array<[string, Formula[]]>]> = []
    for (const [cat, secMap] of map.entries()) {
      const secArr = Array.from(secMap.entries())
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([sec, arr]) => [sec, arr.sort((a,b) => a.title.localeCompare(b.title))] as [string, Formula[]])
      sorted.push([cat, secArr])
    }
    return sorted.sort((a,b) => a[0].localeCompare(b[0]))
  }, [items])

  if (!items.length) {
    return <div className="text-sm text-slate-500">Ingen treff.</div>
  }

  return (
    <div className="space-y-2">
      {grouped.map(([cat, secs]) => (
        <details key={cat} className="nav-details">
          <summary className="nav-summary">{cat}</summary>
          <div className="pl-3 space-y-1">
            {secs.map(([sec, fs]) => (
              <details key={sec} className="nav-details">
                <summary className="nav-subsummary">{sec}</summary>
                <ul className="mt-1 mb-2 space-y-1">
                  {fs.map(f => (
                    <li key={f.id}>
                      <button
                        className="nav-item"
                        onClick={() => onSelect(f)}
                        title={f.formula}
                      >
                        {f.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
/* ==== [BLOCK: NavTree] END ==== */
