/* ==== [BLOCK: FormulaList] BEGIN ==== */
import React from 'react'
import type { Formula } from '@/core/types'


export function FormulaList({ items, activeId, onPick }: {
items: Formula[]
activeId: string | null
onPick: (f: Formula) => void
}) {
return (
<div className="card divide-y divide-line">
<div className="p-3 text-sm text-lineStrong">Formler ({items.length})</div>
<ul className="max-h-[70vh] overflow-auto">
{items.map(f => (
<li key={f.id}>
<button
className={`w-full text-left px-3 py-2 hover:bg-coffee-light/30 ${activeId===f.id?'bg-coffee-light/40':''}`}
onClick={() => onPick(f)}
>
<div className="text-sm text-lineStrong">{f.category} · {f.section}</div>
<div className="font-medium">{f.title}</div>
<div className="text-xs text-lineStrong truncate">{f.formula}</div>
</button>
</li>
))}
</ul>
</div>
)
}
/* ==== [BLOCK: FormulaList] END ==== */
